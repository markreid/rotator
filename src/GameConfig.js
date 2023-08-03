import { useState, useEffect } from "react";

import NumericInput from "./NumericInput";

import "./GameConfig.css";

import { pluralise } from "./util";
import { getConfig, saveConfig } from './configs';

const PERIOD_NAMES = ["periods", "period", "halves", "thirds", "quarters"];

const GameConfig = ({ subMultiplier, setSubMultiplier }) => {
	const [numPeriods, setNumPeriods] = useState(null);
	const [numPlayersOn, setNumPlayersOn] = useState(null);		
	const [periodLengthMinutes, setPeriodLengthMinutes] = useState(null);		

	const [ready, setReady] = useState(false);
	const [hasChanged, setHasChanged] = useState(false);

	const [resetTrigger, setResetTrigger] = useState(Math.random());
	const resetFromSaved = () => setResetTrigger(Math.random());

	useEffect(() => {
		const gameSettings = getConfig("gameConfig");
		setNumPeriods(gameSettings.numPeriods);
		setNumPlayersOn(gameSettings.numPlayersOn);
		setPeriodLengthMinutes(gameSettings.periodLengthMinutes);
		setReady(true);
		setHasChanged(false);
	}, [resetTrigger]);

	if (!ready) return null;

	const saveToConfig = () => {
		saveConfig("gameConfig", {
			numPeriods,
			numPlayersOn,
			periodLengthMinutes,
		});
		setHasChanged(false);
	};

	// call a state setter function and flag hasChanged as true
	const changeAndSet = (setter) => (val) => {
		setter(val);
		setHasChanged(true);
	};

	return (
		<div className="GameConfig page">
			<h2 className="page-title">Game Settings</h2>

			{ready && (
				<>
					<ul className="GameConfig-list">
						<li className="GameConfig-list-item">
							<h3>Periods:</h3>
							<NumericInput
								value={numPeriods}
								onChange={changeAndSet(setNumPeriods)}
							/>
						</li>

						<li className="GameConfig-list-item">
							<h3>Period length (minutes):</h3>
							<NumericInput
								value={periodLengthMinutes}
								onChange={changeAndSet(setPeriodLengthMinutes)}
							/>
						</li>

						<li className="GameConfig-list-item">
							<h3>Players on at once:</h3>
							<NumericInput
								value={numPlayersOn}
								onChange={changeAndSet(setNumPlayersOn)}
							/>
						</li>
					</ul>

					<p className="GameConfig-summary">
						Games will have{" "}
						<b>
							{numPeriods} {PERIOD_NAMES[numPeriods] || "periods"}{" "}
							of {periodLengthMinutes} minutes
						</b>{" "}
						each.
					</p>
					<p className="GameConfig-summary">
						There will be{" "}
						<b>{pluralise(numPlayersOn, "player")} on</b> at a time.
					</p>

					<div className="BigButtons">
						<button
							disabled={!hasChanged}
							className="BigButtons-button"
							onClick={saveToConfig}
						>
							SAVE
						</button>
						<button
							disabled={!hasChanged}
							className="BigButtons-button dangerous"
							onClick={resetFromSaved}
						>
							RESET
						</button>
					</div>
				</>
			)}
		</div>
	);
};

export default GameConfig;
