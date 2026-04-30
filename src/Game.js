import { useState, useEffect, useMemo } from "react";

import Sheet from "@mui/joy/Sheet";
import Grid from "@mui/joy/Grid";
import Button from "@mui/joy/Button";
import AccordionGroup from "@mui/joy/AccordionGroup";
import Accordion from "@mui/joy/Accordion";
import AccordionSummary from "@mui/joy/AccordionSummary";
import AccordionDetails from "@mui/joy/AccordionDetails";


import "./Game.css";

import Timer from "./Timer";
import PlayerList from "./PlayerList";
import GameStats from "./GameStats";
import NotEnoughPlayers from "./NotEnoughPlayers";

import {
	minutesToSeconds,
	calcSubTimes,
	calcPlayerTimesFromSubs,
	calcClockSeconds,
	calculateSubsPlan,
} from "./util";

import { playSound } from "./sound";

import {
	getConfig,
	saveConfig,
	resetConfig,
	getActivePlayers,
	SUB_TIME_THRESHOLD,
} from "./configs";

import { getDevMode } from "./AppConfig";

const Game = ({ subRoute, setSubRoute, navigateTo }) => {
	// game state - might be more readable to use a reducer?
	const gameConfig = useMemo(() => getConfig("gameConfig"), []);
	const subsConfig = useMemo(() => getConfig("subsConfig"), []);
	const [players, setPlayers] = useState(() => getActivePlayers());
	const [subs, setSubs] = useState(() => getConfig("subs"));
	const [clock, setClock] = useState(() => getConfig("clock"));
	const [clockTime, setClockTime] = useState(calcClockSeconds(clock));
	const [subTimes, setSubTimes] = useState(
		calcSubTimes(gameConfig, subsConfig, players),
	);

	const { periodLengthMinutes, numPlayersOn, numPeriods } = gameConfig;
	const periodLengthSeconds = minutesToSeconds(periodLengthMinutes);

	// update the game clock once a second, if it's running.
	// use this effect to trigger things (sounds, game events)
	// based on the timer.
	useEffect(() => {
		if (!clock.clockRunning) return;

		const timer = setInterval(() => {
			const newClockTime = calcClockSeconds(clock);
			setClockTime(newClockTime);

			// next sub coming up
			if (subsConfig.nextSubWarning > 0 && subTimes.includes(newClockTime + subsConfig.nextSubWarning)) {
				playSound("nextSubSoon");
			}

			// next sub!
			if (subTimes.includes(newClockTime)) {
				playSound("nextSubReady");
			}

			// period finshed
			if (newClockTime >= periodLengthSeconds) {
				stopClock();
				playSound("periodFinished");
			}
		}, 1000);
		return () => clearInterval(timer);
	}, [clock, periodLengthSeconds, subTimes]);

	const currentPeriod = 1;

	const startClock = () => {
		const oldClock = getConfig("clock");
		const newClock = {
			...oldClock,
			clockRunning: true,
			clockStartedAt: Date.now(),
		};
		saveConfig("clock", newClock);
		setClock(newClock);
		playSound("clockStart");
	};

	const stopClock = () => {
		const stoppedClock = {
			clockRunning: false,
			clockStartedAt: null,
			secondsAtStart: clockTime,
		};
		setClock(stoppedClock);
		saveConfig("clock", stoppedClock);
	};

	const toggleClock = () => {
		return clock.clockRunning ? stopClock() : startClock();
	};

	// reset the subs
	const resetSubs = () => {
		const newSubs = [
			{
				on: players.slice(0, numPlayersOn),
				off: players.slice(numPlayersOn),
				clockTime: 0,
				numChanges: 0,
			},
		];
		setSubs(newSubs);
		saveConfig("subs", newSubs);
	};

	const resetClock = () => {
		setClockTime(0);
		resetSubs();
		resetConfig("clock");
		setSubTimes(calcSubTimes(gameConfig, subsConfig, players));
	};

	const playersOnField = players.slice(0, numPlayersOn);
	const playersOnBench = players.slice(numPlayersOn);

	const [on, setOn] = useState([]);
	const [off, setOff] = useState([]);
	const resetOnOff = () => {
		setOn([]);
		setOff([]);
	};

	const subsPlan = useMemo(
		() => calculateSubsPlan(players.length, gameConfig, subsConfig),
		[players.length, gameConfig, subsConfig],
	);
	const {
		playersPerSub,
		playerSecondsEach,
		benchSecondsEach,
		timeOnBench,
		timeOnField,
	} = subsPlan;

	// automatically select players for the next sub.
	const autoSub = () => {
		const sortedField = playersOnField
			.slice()
			.sort((a, b) => timeOn[a].lastOn - timeOn[b].lastOn)
			.slice(0, playersPerSub);
		const sortedBench = playersOnBench
			.slice()
			.sort((a, b) => timeOn[a].lastOff - timeOn[b].lastOff)
			.slice(0, playersPerSub);
		setOff(sortedField);
		setOn(sortedBench);
	};

	// add or remove a player from the on/off list
	const select = (getter, setter) => (player) => {
		// removing
		if (getter.includes(player)) {
			return setter(getter.filter((p) => p !== player));
		}
		// adding
		if (getter.length >= players.length - numPlayersOn) {
			return;
		}

		return setter(getter.concat([player]));
	};

	// make a sub
	const makeSub = () => {
		if (on.length !== off.length) return;

		// update the player list
		const subbedPlayers = [].concat(
			players
				.slice(0, numPlayersOn)
				.filter((player) => !off.includes(player)),
			on,
			players
				.slice(numPlayersOn)
				.filter((player) => !on.includes(player)),
			off,
		);

		setPlayers(subbedPlayers);
		saveConfig("players", subbedPlayers);

		// if we're within the threshold, remove
		// the first entry in subTimes
		if (subTimes[0] - clockTime <= SUB_TIME_THRESHOLD) {
			setSubTimes(subTimes.slice(1));
		}

		// reset selected
		setOn([]);
		setOff([]);

		// log the sub
		const sub = {
			on: subbedPlayers.slice(0, numPlayersOn),
			off: subbedPlayers.slice(numPlayersOn),
			clockTime,
			numChanges: on.length,
		};
		// if the clock hasn't started, replace the first one.
		const newSubs = clockTime === 0 ? [sub] : subs.concat([sub]);
		setSubs(newSubs);
		saveConfig("subs", newSubs);
		playSound("makeSub");
	};

	const timeOn = calcPlayerTimesFromSubs(players, subs, clockTime);

	if (players.length < numPlayersOn) {
		return (
			<div className="Game">
				<NotEnoughPlayers navigateTo={navigateTo} />
			</div>
		);
	}

	const devMode = getDevMode();

	return (
		<div className="Game">
			<Timer
				{...{
					clockTime,
					currentPeriod,
					numPeriods,
					periodLengthSeconds,
					clockRunning: clock.clockRunning,
					toggleClock,
					resetClock,
					setSubRoute,
					subRoute,
					subTimes,
				}}

			/>

			
			{subRoute === "stats" ? (
				<GameStats
					{...{
						subs,
						players,
						clockTime,
						numPlayersOn,
						playerSecondsEach,
						benchSecondsEach,
						timeOnBench,
						timeOnField,
						timeOn,
					}}
				/>	
			) : (
				<>
					<Sheet variant="sxoft">
						<Grid
							container
							spacing={2}
							sx={{
								flexGrow: 1,
								justifyContent: "space-around",
							}}
						>
							<Grid xs={6} sx={{ textAlign: 'center' }}>
								{!on.length && !off.length ? (
									<Button onClick={autoSub}>Auto Sub</Button>
								) : (
									<Button
										color="success"
										disabled={
											!on.length ||
											on.length !== off.length
										}
										onClick={makeSub}
									>
										Make Sub
									</Button>
								)}
							</Grid>
							<Grid xs={6} sx={{ textAlign: 'center' }}>
								<Button color="danger" disabled={!on.length && !off.length} onClick={resetOnOff}>
									Clear
								</Button>
							</Grid>
						</Grid>
					</Sheet>

					<Grid
						container
						columns={12}
						spacing={0}
						gap={0}
						sx={{ justifyContent: "space-between" }}
					>
						<Grid xs={6}>
							<PlayerList
								{...{
									players: playersOnField,
									variant: "on",
									className: "field",
									selected: off,
									select: select(off, setOff),
									timeOn,
									targetTimeOn: timeOnField,
									targetTotalTime: playerSecondsEach,
									inverseTotalTime: benchSecondsEach,
									subTimes,
									nextSubWarning: subsConfig.nextSubWarning,
									playersPerSub,
									clockTime,
								}}
							/>
						</Grid>
						<Grid xs={6}>
							<PlayerList
								{...{
									players: playersOnBench,
									variant: "off",
									className: "bench",
									selected: on,
									select: select(on, setOn),
									timeOn,
									targetTimeOn: timeOnBench,
									targetTotalTime: benchSecondsEach,
									inverseTotalTime: playerSecondsEach,
									subTimes,
									nextSubWarning: subsConfig.nextSubWarning,
									playersPerSub,
									clockTime,
								}}
							/>
						</Grid>
					</Grid>
				</>
			)}

			{devMode && (
				<AccordionGroup sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000, background: '#fff', boxShadow: '0 -2px 8px rgba(0,0,0,0.15)', borderTop: '1px solid #ccc' }}>
					<Accordion>
						<AccordionSummary>Debug State</AccordionSummary>
						<AccordionDetails>
							<pre style={{ fontSize: '0.7em', padding: '8px', overflow: 'auto', maxHeight: '50vh', color: '#888', background: '#f5f5f5' }}>
								{JSON.stringify({
									clock,
									clockTime,
									players,
									playersOnField,
									playersOnBench,
									on,
									off,
									subs,
									subTimes,
									subsPlan,
									gameConfig,
									subsConfig,
									timeOn,
									currentPeriod,
								}, null, 2)}
							</pre>
						</AccordionDetails>
					</Accordion>
				</AccordionGroup>
			)}
		</div>
	);
};

export default Game;
