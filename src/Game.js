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
	calcPlayerTimesFromSubs,
	calcClockSeconds,
	calculateSubsPlan,
	calculateShouldStay,
	reconcileLineup,
	calcEffectivePool,
	countSubEvents,
	scheduleSignature,
	calcForwardSchedule,
} from "./util";

import { playSound } from "./sound";

import {
	getConfig,
	saveConfig,
	resetConfig,
	getActivePlayers,
	SUB_TIME_THRESHOLD,
	SHOULD_STAY_THRESHOLD,
	MIN_SPELL_FRACTION,
} from "./configs";

import { getDevMode } from "./AppConfig";

const Game = ({ subRoute, setSubRoute, navigateTo }) => {
	// game state - might be more readable to use a reducer?
	const gameConfig = useMemo(() => getConfig("gameConfig"), []);
	const subsConfig = useMemo(() => getConfig("subsConfig"), []);
	// the lineup (field/bench ordering) lives in its own config key so the
	// game never overwrites the roster. on mount we reconcile the saved
	// lineup against the current active roster: this is what flows roster
	// changes (late arrivals, players pulled out) into an in-progress game,
	// since navigating back to this screen remounts the component.
	const [players, setPlayers] = useState(() => {
		const activeRoster = getActivePlayers();
		const savedLineup = getConfig("lineup");
		return savedLineup.length
			? reconcileLineup(savedLineup, activeRoster)
			: activeRoster;
	});
	// players fixed in place (keeper, injured player). they hold their slot
	// but leave the rotating pool — see the effective plan below.
	const [fixed, setFixed] = useState(() => getConfig("fixedPlayers"));
	const [subs, setSubs] = useState(() => getConfig("subs"));
	const [clock, setClock] = useState(() => getConfig("clock"));
	const [clockTime, setClockTime] = useState(calcClockSeconds(clock));
	// load the persisted forward schedule as-is; the re-plan effect below
	// recomputes it if the pool changed while we were off this screen.
	const [subTimes, setSubTimes] = useState(() => getConfig("schedule").times);

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

			// next sub coming in nextSubWarning seconds
			if (
				subsConfig.nextSubWarning > 0 &&
				subTimes.includes(newClockTime + subsConfig.nextSubWarning)
			) {
				playSound("nextSubSoon");
			}

			// next sub is now
			if (subTimes.includes(newClockTime)) {
				playSound("nextSubReady");
			}

			// period has finished
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
		const times = calcForwardSchedule({
			clockTime: 0,
			periodLengthSeconds,
			numChanges: subsPlan.numChanges,
			naturalSubEvery: subsPlan.subEvery,
			eventsMade: 0,
			floorFraction: MIN_SPELL_FRACTION,
		});
		setSubTimes(times);
		saveConfig("schedule", { times, signature: scheduleSignature(subsPlan) });
	};

	const playersOnField = players.slice(0, numPlayersOn);
	const playersOnBench = players.slice(numPlayersOn);

	const [on, setOn] = useState([]);
	const [off, setOff] = useState([]);
	const resetOnOff = () => {
		setOn([]);
		setOff([]);
	};

	// fix/unfix a player in place. re-planning is handled by the signature
	// effect above (the pool changes -> the schedule recomputes).
	const toggleFixed = (name) => {
		const updated = fixed.includes(name)
			? fixed.filter((p) => p !== name)
			: fixed.concat([name]);
		setFixed(updated);
		saveConfig("fixedPlayers", updated);
		// a fixed player can't be part of a pending sub
		setOn((prev) => prev.filter((p) => p !== name));
		setOff((prev) => prev.filter((p) => p !== name));
	};

	// the effective plan: fixed players hold their slot but drop out of the
	// rotating pool, so all the sub maths runs against the reduced counts.
	const subsPlan = useMemo(() => {
		const { fixedOnField, fixedOnBench } = calcEffectivePool(
			players,
			fixed,
			numPlayersOn,
		);
		return calculateSubsPlan(players.length, gameConfig, subsConfig, {
			onField: fixedOnField,
			onBench: fixedOnBench,
		});
	}, [players, fixed, numPlayersOn, gameConfig, subsConfig]);
	const {
		playersPerSub,
		playerSecondsEach,
		benchSecondsEach,
		timeOnBench,
		timeOnField,
		subEvery,
	} = subsPlan;

	const stayThreshold = subEvery * SHOULD_STAY_THRESHOLD;

	// re-plan the forward schedule whenever the rotating pool changes (a fix
	// toggled, a player arriving/leaving, or settings changed) — but not on
	// every navigation, so bells don't drift. the signature captures the pool.
	const signature = scheduleSignature(subsPlan);
	useEffect(() => {
		if (getConfig("schedule").signature === signature) return;
		const times = calcForwardSchedule({
			clockTime: calcClockSeconds(clock),
			periodLengthSeconds,
			numChanges: subsPlan.numChanges,
			naturalSubEvery: subsPlan.subEvery,
			eventsMade: countSubEvents(subs),
			floorFraction: MIN_SPELL_FRACTION,
		});
		setSubTimes(times);
		saveConfig("schedule", { times, signature });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [signature]);

	const shouldStay = (player, variant) => {
		const inverseVariant = variant === "on" ? "off" : "on";
		const inverseTotalTime =
			variant === "on" ? benchSecondsEach : playerSecondsEach;
		return calculateShouldStay(
			inverseTotalTime,
			timeOn[player][inverseVariant],
			stayThreshold,
		);
	};

	// automatically select players for the next sub.
	const autoSub = () => {
		const sortedField = playersOnField
			.slice()
			.filter((p) => !fixed.includes(p) && !shouldStay(p, "on"))
			.sort((a, b) => timeOn[a].lastOn - timeOn[b].lastOn)
			.slice(0, playersPerSub);
		const sortedBench = playersOnBench
			.slice()
			.filter((p) => !fixed.includes(p) && !shouldStay(p, "off"))
			.sort((a, b) => timeOn[a].lastOff - timeOn[b].lastOff)
			.slice(0, playersPerSub);
		setOff(sortedField);
		setOn(sortedBench);
	};

	// add or remove a player from the on/off list
	const select = (getter, setter) => (player) => {
		// fixed players don't rotate, so they can't be selected for a sub
		if (fixed.includes(player)) return;
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
		saveConfig("lineup", subbedPlayers);

		// if we're within the threshold, consume the next scheduled bell.
		// persist so navigating away doesn't bring the consumed bell back.
		const consumed =
			subTimes.length > 0 &&
			subTimes[0] - clockTime <= SUB_TIME_THRESHOLD;
		const newTimes = consumed ? subTimes.slice(1) : subTimes;
		if (consumed) {
			setSubTimes(newTimes);
			saveConfig("schedule", {
				times: newTimes,
				signature: scheduleSignature(subsPlan),
			});
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
						fixed,
					}}
				/>
			) : (
				<>
					<Sheet variant="soft" className="GameButtons">
						<Grid
							container
							spacing={2}
							sx={{
								flexGrow: 1,
								justifyContent: "space-around",
							}}
						>
							<Grid xs={6} sx={{ textAlign: "center" }}>
								{!on.length && !off.length ? (
									<Button
										onClick={autoSub}
										sx={{ background: "var(--c4)" }}
									>
										Auto Sub
									</Button>
								) : (
									<Button
										sx={{ background: "var(--ondark)" }}
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
							<Grid xs={6} sx={{ textAlign: "center" }}>
								<Button
									color="danger"
									disabled={!on.length && !off.length}
									onClick={resetOnOff}
								>
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
									stayThreshold,
									subTimes,
									nextSubWarning: subsConfig.nextSubWarning,
									playersPerSub,
									clockTime,
									subs,
									fixed,
									toggleFixed,
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
									stayThreshold,
									subTimes,
									nextSubWarning: subsConfig.nextSubWarning,
									playersPerSub,
									clockTime,
									subs,
									fixed,
									toggleFixed,
								}}
							/>
						</Grid>
					</Grid>
				</>
			)}

			{devMode && (
				<AccordionGroup
					sx={{
						position: "fixed",
						bottom: 0,
						left: 0,
						right: 0,
						zIndex: 1000,
						background: "#fff",
						boxShadow: "0 -2px 8px rgba(0,0,0,0.15)",
						borderTop: "1px solid #ccc",
					}}
				>
					<Accordion>
						<AccordionSummary>Debug State</AccordionSummary>
						<AccordionDetails>
							<pre
								style={{
									fontSize: "0.7em",
									padding: "8px",
									overflow: "auto",
									maxHeight: "50vh",
									color: "#888",
									background: "#f5f5f5",
								}}
							>
								{JSON.stringify(
									{
										clock,
										clockTime,
										players,
										playersOnField,
										playersOnBench,
										fixed,
										on,
										off,
										subs,
										subTimes,
										subsPlan,
										gameConfig,
										subsConfig,
										timeOn,
										currentPeriod,
									},
									null,
									2,
								)}
							</pre>
						</AccordionDetails>
					</Accordion>
				</AccordionGroup>
			)}
		</div>
	);
};

export default Game;
