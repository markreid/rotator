import { useState, useEffect } from "react";

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
		const sub = subs[index];
		
		// remove the sub from the sub list		
		setSubs(removeElement(subs, index));
		
		// sub the players
		setPlayers([].concat(
			players.slice(0, numPlayersOn).filter(player => player !== off),
			on,
			players.slice(numPlayersOn).filter(player => player !== on),
			off,		
		));



		// setPlayersOnField(
		// 	playersOnField.filter((name) => name !== off).concat([on])
		// );
		// setPlayersOnBench(
		// 	playersOnBench.filter((name) => name !== on).concat([off])
		// );
		// setSubs(setSubAsMade(subs, index));
	};

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
					subs,
					subsPerChange,
					players,
					clockTime,
					makeSub,
				}}
			/>

			<div className="PlayerLists">

			<PlayerList
				{...{
					players: playersOnField,
					title: "Field",
				}}
			/>
			<PlayerList
				{...{
					players: playersOnBench,
					title: "Bench",
				}}
			/>
			</div>
		</div>
	);
};

export default Game;
