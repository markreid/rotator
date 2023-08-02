import { useState, useEffect } from "react";

import NumericInput from "./NumericInput";

import "./GameConfig.css";

import { getConfig, saveConfig, pluralise } from "./util";

const DEFAULT_SETTINGS = {
	numPeriods: 1,
	periodLengthMinutes: 15,
	numPlayersOn: 4,
};

const PERIOD_NAMES = ["periods", "period", "halves", "thirds", "quarters"];

const GameConfig = ({ subMultiplier, setSubMultiplier }) => {
	// set default state
	// but we'll override from localStorage in the useEffect
	const [numPeriods, setNumPeriods] = useState(DEFAULT_SETTINGS.numPeriods);
	const [numPlayersOn, setNumPlayersOn] = useState(
		DEFAULT_SETTINGS.numPlayersOn
	);
	const [periodLengthMinutes, setPeriodLengthMinutes] = useState(
		DEFAULT_SETTINGS.periodLength
	);

	const [ready, setReady] = useState(false);
	const [hasChanged, setHasChanged] = useState(false);

	// use this to re-run the effect which fetches config from localstorage
	const [effectTrigger, setEffectTrigger] = useState(Math.random());
	const resetFromSaved = () => setEffectTrigger(Math.random());

	useEffect(() => {
		const gameSettings = getConfig("gameSettings", { ...DEFAULT_SETTINGS });

		setNumPeriods(gameSettings.numPeriods);
		setNumPlayersOn(gameSettings.numPlayersOn);
		setPeriodLengthMinutes(gameSettings.periodLengthMinutes);
		setReady(true);
		setHasChanged(false);
	}, [effectTrigger]);

	const saveToConfig = () => {
		saveConfig("gameSettings", {
			numPeriods,
			numPlayersOn,
			periodLengthMinutes,
		});
		resetFromSaved();
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
