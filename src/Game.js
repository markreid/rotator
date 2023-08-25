import { useState, useEffect, useMemo } from "react";

import "./Game.css";

import Timer from "./Timer";
import NextSub from "./NextSub";
import PlayerList from "./PlayerList";
import GameStats from "./GameStats";

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
	SUB_TIME_THRESHOLD,
	NEXT_SUB_WARNING,
} from "./configs";

const Game = ({ subRoute }) => {
	// game state - might be more readable to use a reducer?
	const gameConfig = useMemo(() => getConfig("gameConfig"), []);
	const subsConfig = useMemo(() => getConfig("subsConfig"), []);
	const [players, setPlayers] = useState(() => getConfig("players"));
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
			if (subTimes.includes(newClockTime + NEXT_SUB_WARNING)) {
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
		setOff(players.slice(0, playersPerSub));
		setOn(players.slice(numPlayersOn, numPlayersOn + playersPerSub));
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
				}}
			/>

			<NextSub
				{...{
					subTimes,
					clockTime,
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
					<div className="Sub-Button">
						{!on.length && !off.length ? (
							<button
								className="Sub-Button-button autosub"
								onClick={autoSub}
							>
								Auto Sub
							</button>
						) : (
							<button
								className="Sub-Button-button clear"
								onClick={resetOnOff}
							>
								Clear
							</button>
						)}
						<button
							className="Sub-Button-button makesub"
							disabled={!on.length || on.length !== off.length}
							onClick={makeSub}
						>
							Make Sub
						</button>
					</div>

					<div className="PlayerList-titles">
						<h2 className="PlayerList-title on">Field</h2>
						<h2 className="PlayerList-title off">Bench</h2>
					</div>

					<div className="PlayerList-container">
						<PlayerList
							{...{
								players: playersOnField,
								variant: "on",
								className: "field",
								selected: off,
								select: select(off, setOff),
								timeOn,
								targetTimeOn: timeOnField,
								clockTime,
							}}
						/>
						<PlayerList
							{...{
								players: playersOnBench,
								variant: "off",
								className: "bench",
								selected: on,
								select: select(on, setOn),
								timeOn,
								targetTimeOn: timeOnBench,
								clockTime,
							}}
						/>
					</div>
				</>
			)}
		</div>
	);
};

export default Game;
