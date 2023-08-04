import { useState, useEffect } from "react";

import "./Game.css";

import Timer from "./Timer";
import NextSub from "./NextSub";
import PlayerList from "./PlayerList";

import {
	minutesToSeconds,
	calcSubTimes,
	calcPlayerTimesFromSubs,
	calcClockSeconds,
	calcChanges,
} from "./util";

import { playSound } from "./sound";

import {
	getConfig,
	saveConfig,
	resetConfig,
	SUB_TIME_THRESHOLD,
	NEXT_SUB_WARNING,
} from "./configs";

const Game = () => {
	const [{ numPlayersOn, periodLengthMinutes, numPeriods }, setGameConfig] =
		useState({});
	const [ready, setReady] = useState(false);
	const [players, setPlayers] = useState([]);
	const [{ playersPerSub, subMultiplier }, setSubConfig] = useState({});
	const [subTimes, setSubTimes] = useState([]);

	const [subs, setSubs] = useState(getConfig("subs"));

	useEffect(() => {
		const savedPlayers = getConfig("players");
		const savedSubsConfig = getConfig("subsConfig");
		const savedGameConfig = getConfig("gameConfig");

		setPlayers(savedPlayers);
		setSubConfig(savedSubsConfig);
		setGameConfig(savedGameConfig);

		setSubTimes(
			calcSubTimes(savedGameConfig, savedSubsConfig, savedPlayers)
		);
		setReady(true);

		// todo - if there are no game settings set some key to show
		// that we're doing a fresh load
	}, []);

	// game state
	const currentPeriod = 1;
	const periodLengthSeconds = minutesToSeconds(periodLengthMinutes);

	const [clock, setClock] = useState(getConfig("clock"));
	const [clockTime, setClockTime] = useState(
		// todo - i think replace this with the clock var from above
		calcClockSeconds(getConfig("clock"))
	);

	// update our game clock every second while the clock is running.
	// tick tock.
	useEffect(() => {
		if (!clock.clockRunning) return;

		const timer = setInterval(() => {
			const ct = calcClockSeconds(clock);
			setClockTime(ct);

			// next sub coming up
			if (subTimes.includes(ct + NEXT_SUB_WARNING)) {
				playSound("nextSubSoon");
			}

			// next sub!
			if (subTimes.includes(ct)) {
				playSound("nextSubReady");
			}

			// period finshed
			if (ct >= periodLengthSeconds) {
				stopClock();
				playSound("periodFinished");
			}
		}, 1000);
		return () => clearInterval(timer);
	}, [clock, periodLengthSeconds]);

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
		setClock(resetConfig("clock"));
	};

	const playersOnField = players.slice(0, numPlayersOn);
	const playersOnBench = players.slice(numPlayersOn);

	const [on, setOn] = useState([]);
	const [off, setOff] = useState([]);
	const resetOnOff = () => {
		setOn([]);
		setOff([]);
	};

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
			off
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

	// todo - this logic is duplicate in subConfig
	// break it into a util
	// but also don't run it every render
	const numPlayers = players.length;
	const numPlayersOff = numPlayers - numPlayersOn;
	const playerSecondsEach = (periodLengthSeconds * numPlayersOn) / numPlayers;
	const benchSecondsEach = (periodLengthSeconds * numPlayersOff) / numPlayers;
	const changesOnBench = Math.ceil(numPlayersOff / playersPerSub);
	const numChanges = calcChanges(
		numPlayersOn,
		numPlayers,
		playersPerSub,
		subMultiplier
	);
	const subEvery = periodLengthSeconds / (numChanges + 1);
	const timeOnBench = changesOnBench * subEvery;
	const changesOnField = Math.ceil(numPlayersOn / playersPerSub);
	const timeOnField = changesOnField * subEvery;

	if (!ready) return null;

	const timeOn = calcPlayerTimesFromSubs(players, subs, clockTime);

	return !ready ? null : (
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

			
		</div>
	);
};

export default Game;
