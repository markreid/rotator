import { useState, useEffect } from "react";

import "./SubConfig.css";
import {
	pluralise,
	minutesToSeconds,
	calcChanges,
	formatClock,
} from "./util";

import { getConfig, saveConfig } from'./configs';

import NumericInput from "./NumericInput";


const SubConfig = ({ navigateTo }) => {
	const [players, setPlayers] = useState(null);
	const [gameConfig, setGameConfig] = useState(null);
	const [playersPerSub, setPlayersPerSub] = useState(null);
	const [subMultiplier, setSubMultiplier] = useState(null);

	const [ready, setReady] = useState(false);
	const [resetTrigger, setResetTrigger] = useState(Math.random());
	const resetFromSaved = () => setResetTrigger(Math.random());
	const [hasChanged, setHasChanged] = useState(false);

	useEffect(() => {
		const subConfig = getConfig('subsConfig');
		setPlayersPerSub(subConfig.playersPerSub);
		setSubMultiplier(subConfig.subMultiplier);
			
		setPlayers(getConfig('players'));
		setGameConfig(getConfig('gameConfig'));

		setReady(true);
		setHasChanged(false);
	}, [resetTrigger]);

	if (!ready) return null;

	// lots of complicated derived state below
	const { numPlayersOn } = gameConfig;
	const periodLengthSeconds = minutesToSeconds(gameConfig.periodLengthMinutes);
	const numPlayers = players.length;
	const numPlayersOff = numPlayers - numPlayersOn;

	const playerMinutesEach = (periodLengthSeconds * numPlayersOn) / numPlayers;
	const benchMinutesEach = (periodLengthSeconds * numPlayersOff) / numPlayers;

	const numChanges = calcChanges(numPlayersOn, numPlayers, playersPerSub, subMultiplier);
	const subEvery = periodLengthSeconds / (numChanges + 1);

	// how long a player spends on/off in total
	const changesOnBench = Math.ceil(numPlayersOff / playersPerSub);
	const timeOnBench = changesOnBench * subEvery;
	const changesOnField = Math.ceil(numPlayersOn / playersPerSub);
	const timeOnField = changesOnField * subEvery;

	const saveToConfig = () => {
		saveConfig("subsConfig", {
			playersPerSub,
			subMultiplier,
		});
		setHasChanged(false);
		resetFromSaved();
	};

	
	// call a state setter function and flag hasChanged as true
	const changeAndSet = (setter) => (val) => {
		setter(val);
		setHasChanged(true);
	}

	return (
		<div className="SubConfig page">
			<div className="page-title">Subs Settings</div>

			{ready && numChanges !== 0 && (
				<>
					<ul className="GameConfig-list">
						<li className="GameConfig-list-item">
							<h3>Players changed each sub:</h3>
							<NumericInput
								min={1}
								max={Math.max(numPlayers - numPlayersOn, 1)}
								value={playersPerSub}
								onChange={changeAndSet(setPlayersPerSub)}
							/>
						</li>

						<li className="GameConfig-list-item">
							<h3>Sub frequency:</h3>

							<NumericInput
								value={subMultiplier}
								displayValue={formatClock(subEvery)}
								min={1}
								max={30}
								onChange={changeAndSet(setSubMultiplier)}
								readonly={true}
							/>
						</li>
					</ul>

					<p className="GameConfig-summary">
						<b>{pluralise(playersPerSub, "player")}</b> every{" "}
						<b>{formatClock(subEvery)}</b> (<b>{pluralise(numChanges, 'sub')}</b> per
						period.)
					</p>

					<p className="GameConfig-summary">
						Players will be <b>on for {formatClock(timeOnField)}</b>{" "}
						and <b>off for {formatClock(timeOnBench)}</b> at a time.
					</p>

					<p className="GameConfig-summary">
						In total, each player gets{" "}
						<b>{formatClock(playerMinutesEach)} on</b> and{" "}
						<b>{formatClock(benchMinutesEach)} off</b>.
					</p>

					<div className="BigButtons">
						<button
							className="BigButtons-button"
							onClick={saveToConfig}
							disabled={!hasChanged}
						>
							SAVE
						</button>
						<button
							className="BigButtons-button dangerous"
							onClick={resetFromSaved}
							disabled={!hasChanged}
						>
							RESET
						</button>
					</div>
				</>
			)}

			{ready && numChanges === 0 && (<>
				<p className="GameConfig-summary">You don't have enough players to make subs.</p>
				<p className="GameConfig-summary">You may need to update your players or change the game settings.</p>

				<div className="BigButtons">
					<button onClick={() => navigateTo('PLAYERS')} className="BigButtons-button">Edit Players</button>
					<button onClick={() => navigateTo('GAME SETTINGS')} className="BigButtons-button alt">Configure Game</button>
				</div>
			</>)}

			
		</div>
	);
};

export default SubConfig;
