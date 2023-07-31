import { useState, useEffect } from "react";

import "./SubConfig.css";
import {
	pluralise,
	getConfig,
	saveConfig,
	minutesToSeconds,
	calcChanges,
	formatClock,
} from "./util";

import NumericInput from "./NumericInput";

const DEFAULT_SETTINGS = {
	playersPerSub: 1,
	subMultiplier: 1,
};

const SubConfig = () => {
	const players = getConfig("players", []);
	const { numPlayersOn, periodLengthMinutes } = getConfig("gameSettings", {});

	const periodLengthSeconds = minutesToSeconds(periodLengthMinutes);

	const [playersPerSub, setPlayersPerSub] = useState(
		DEFAULT_SETTINGS.playersPerSub
	);
	const [subMultiplier, setSubMultiplier] = useState(
		DEFAULT_SETTINGS.subMultiplier
	);

	const [ready, setReady] = useState(false);
	const [effectTrigger, setEffectTrigger] = useState(Math.random());
	const resetFromSaved = () => setEffectTrigger(Math.random());

	useEffect(() => {
		const subSettings = getConfig("subConfig", { ...DEFAULT_SETTINGS });
		setPlayersPerSub(subSettings.playersPerSub);
		setSubMultiplier(subSettings.subMultiplier);
		setReady(true);
	}, [effectTrigger]);

	// lots of complicated derived state below
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
		saveConfig("subConfig", {
			playersPerSub,
			subMultiplier,
		});
		resetFromSaved();
	};

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
								onChange={setPlayersPerSub}
							/>
						</li>

						<li className="GameConfig-list-item">
							<h3>Sub frequency:</h3>

							<NumericInput
								value={subMultiplier}
								displayValue={formatClock(subEvery)}
								min={1}
								max={30}
								onChange={(val) => setSubMultiplier(val)}
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

					<div className="GameConfig-buttons">
						<button
							className="GameConfig-buttons-button"
							onClick={saveToConfig}
						>
							SAVE
						</button>
						<button
							className="GameConfig-buttons-button"
							onClick={resetFromSaved}
						>
							RESET
						</button>
					</div>
				</>
			)}

			{ready && numChanges === 0 && (<>
				<p className="GameConfig-summary">You don't have enough players to make subs.</p>
				<p className="GameConfig-summary">You may need to update your players or change the game settings.</p>
			</>)}

			
		</div>
	);
};

export default SubConfig;
