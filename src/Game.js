import { useState, useEffect } from "react";

import "./Game.css";

import Timer from "./Timer";
import NextSub from "./NextSub";
import PlayerList from "./PlayerList";

import {
	minutesToSeconds,
	calcSubTimes,
	removeElement,
	getConfig,
} from "./util";

const Game = () => {
	const [{ numPlayersOn, periodLengthMinutes, numPeriods }, setGameSettings] =
		useState({});

	const [configReady, setConfigReady] = useState(false);
	// const [reloadConfigKey, reloadConfigTrigger] = useState(Math.random());
	// const reloadConfig = () => reloadConfigTrigger(Math.random());

	const [players, setPlayers] = useState([]);
	const [{ subsPerChange }, setSubSettings] = useState({});
	const [subs, setSubs] = useState([]);

	useEffect(
		() => {
			const savedPlayers = getConfig("players", []);
			const savedSubSettings = getConfig("subConfig", {});
			const savedGameSettings = getConfig("gameSettings", {});

			setPlayers(savedPlayers);
			setSubSettings(savedSubSettings);
			setGameSettings(savedGameSettings);

			const subs = calcSubTimes(
				savedGameSettings,
				savedSubSettings,
				savedPlayers
			);
			setSubs(subs);
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
	const [clockTime, setClockTime] = useState(() => 0);
	const [clockRunning, setClockRunning] = useState(() => false);

	// if the clock's running, tick it up once a second
	useEffect(() => {
		if (!clockRunning) return;
		const clockTick = () =>
			setClockTime((previous) =>
				Math.min(periodLengthSeconds, previous + 1)
			);
		const timer = setInterval(clockTick, 1000);
		return () => clearInterval(timer);
	}, [clockRunning, periodLengthSeconds]);

	// helpers
	const toggleClock = () => setClockRunning(!clockRunning);
	const resetClock = () => {
		setClockTime(0);
		setClockRunning(false);
	};

	const playersOnField = players.slice(0, numPlayersOn);
	const playersOnBench = players.slice(numPlayersOn);

	// make a sub
	const makeSub = (index, on, off) => {
		// sub the players
		setPlayers(
			[].concat(
				players
					.slice(0, numPlayersOn)
					.filter((player) => player !== off),
				on,
				players.slice(numPlayersOn).filter((player) => player !== on),
				off
			)
		);

		// if this is a sub from the suggested list, remove it
		// this needs to be changed, it never happens
		
		if (index !== null) setSubs(removeElement(subs, index));

		// reset selected
		setOn(null);
		setOff(null);
	};

	const [on, setOn] = useState(null);
	const [off, setOff] = useState(null);

	const autoSub = () => {
		setOff(players[0]);
		setOn(players[numPlayersOn])
	}


	return !configReady ? null : (
		<div className="Game">
			<Timer
				{...{
					clockTime,
					currentPeriod,
					numPeriods,
					periodLengthSeconds,
					clockRunning,
					toggleClock,
					resetClock,
				}}
			/>

			<NextSub
				{...{
					subTimes: subs,
					subsPerChange,
					players,
					clockTime,
					makeSub,
				}}
			/>


			<div className="Sub-Button">
				{!on && !off ? (
					<button className="Sub-Button-button autosub" onClick={autoSub}>Auto Sub</button>
				) : (
					<button className="Sub-Button-button makesub" onClick={() => makeSub(null, on, off)}>Make Sub</button>
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
						className: 'field',
						selected: off,
						select: setOff,
					}}
				/>
				<PlayerList
					{...{
						players: playersOnBench,
						className: 'bench',
						selected: on,
						select: setOn,
					}}
				/>
			</div>
		</div>
	);
};

export default Game;
