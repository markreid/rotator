import { useState, useEffect } from "react";

import "./Game.css";

import Timer from "./Timer";
import NextSub from "./NextSub";
import PlayerList from "./PlayerList";

import {
	minutesToSeconds,
	calcSubTimes,
	getConfig,
	saveConfig,
	calcClockSeconds,
} from "./util";

const CLOCK_DEFAULTS = {
	clockRunning: false,
	clockStartedAt: null,
	secondsAtStart: 0,
};

const Game = () => {
	const [{ numPlayersOn, periodLengthMinutes, numPeriods }, setGameSettings] =
		useState({});

	const [configReady, setConfigReady] = useState(false);
	const [players, setPlayers] = useState([]);
	const [{ playersPerSub }, setSubSettings] = useState({});
	const [subTimes, setSubTimes] = useState([]);

	useEffect(
		() => {
			// none of this is async, it could just happen directly above?
			const savedPlayers = getConfig("players", []);
			const savedSubSettings = getConfig("subConfig", {});
			const savedGameSettings = getConfig("gameSettings", {});

			setPlayers(savedPlayers);
			setSubSettings(savedSubSettings);
			setGameSettings(savedGameSettings);

			setSubTimes(
				calcSubTimes(savedGameSettings, savedSubSettings, savedPlayers)
			);
			setConfigReady(true);

			// todo - if there are no game settings set some key to show
			// that we're doing a fresh load
		},
		[
			// reloadConfigKey
		]
	);

	// game state
	const currentPeriod = 1;
	const periodLengthSeconds = minutesToSeconds(periodLengthMinutes);

	const [clock, setClock] = useState(getConfig("clock", CLOCK_DEFAULTS));
	const [clockTime, setClockTime] = useState(
		calcClockSeconds(getConfig("clock", CLOCK_DEFAULTS))
	);

	// update our game clock every second while the clock is running.
	// tick tock.
	useEffect(() => {
		if (!clock.clockRunning) return;

		const timer = setInterval(() => {
			setClockTime(calcClockSeconds(clock));
		}, 1000);
		return () => clearInterval(timer);
	}, [clock]);

	const startClock = () => {
		setClock(true);
		const oldClock = getConfig("clock");
		const newClock = {
			...oldClock,
			clockRunning: true,
			clockStartedAt: Date.now(),
		};
		saveConfig("clock", newClock);
		setClock(newClock);
	};

	const stopClock = () => {
		const newClock = {
			clockRunning: false,
			clockStartedAt: null,
			secondsAtStart: clockTime,
		};
		saveConfig("clock", newClock);
		setClock(newClock);
	};

	// helpers
	const toggleClock = () => {
		return clock.clockRunning ? stopClock() : startClock();
	};

	const resetClock = () => {
		setClockTime(0);
		const newClock = {
			clockRunning: false,
			clockStartedAt: null,
			secondsAtStart: 0,
		};
		saveConfig("clock", newClock);
		setClock(newClock);
	};

	const playersOnField = players.slice(0, numPlayersOn);
	const playersOnBench = players.slice(numPlayersOn);

	const [on, setOn] = useState([]);
	const [off, setOff] = useState([]);

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

		// sub the players
		setPlayers(
			[].concat(
				players
					.slice(0, numPlayersOn)
					.filter((player) => !off.includes(player)),
				on,
				players
					.slice(numPlayersOn)
					.filter((player) => !on.includes(player)),
				off
			)
		);

		// reset selected
		setOn([]);
		setOff([]);
	};

	return !configReady ? null : (
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
						className="Sub-Button-button makesub"
						disabled={on.length !== off.length}
						onClick={makeSub}
					>
						Make Sub
					</button>
				)}
			</div>

			<div className="PlayerList-titles">
				<h2 className="PlayerList-title field">Field</h2>
				<h2 className="PlayerList-title bench">Bench</h2>
			</div>

			<div className="PlayerList-container">
				<PlayerList
					{...{
						players: playersOnField,
						className: "field",
						selected: off,
						select: select(off, setOff),
					}}
				/>
				<PlayerList
					{...{
						players: playersOnBench,
						className: "bench",
						selected: on,
						select: select(on, setOn),
					}}
				/>
			</div>
		</div>
	);
};

export default Game;
