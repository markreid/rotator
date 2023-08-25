import { useState, useMemo } from "react";

import "./SubConfig.css";
import { pluralise, formatClock, calculateSubsPlan } from "./util";

import { getConfig, saveConfig } from "./configs";

import NumericInput from "./NumericInput";

const SubConfig = ({ navigateTo }) => {
	// const [resetTrigger, setResetTrigger] = useState(Math.random());
	// const resetFromSaved = () => setResetTrigger(Math.random());

	const players = useMemo(() => getConfig("players"), []);
	const gameConfig = useMemo(() => getConfig("gameConfig"), []);
	const subsConfig = useMemo(() => getConfig("subsConfig"), []);

	const [playersPerSub, setPlayersPerSub] = useState(
		subsConfig.playersPerSub,
	);
	const [subMultiplier, setSubMultiplier] = useState(
		subsConfig.subMultiplier,
	);
	const [hasChanged, setHasChanged] = useState(false);

	const subsPlan = useMemo(
		() =>
			calculateSubsPlan(players.length, gameConfig, {
				playersPerSub,
				subMultiplier,
			}),
		[players.length, gameConfig, playersPerSub, subMultiplier],
	);

	const resetFromSaved = () => {
		setPlayersPerSub(subsConfig.playersPerSub);
		setSubMultiplier(subsConfig.subMultiplier);
		setHasChanged(false);
	};


	const {
		numChanges,
		numPlayers,
		numPlayersOn,
		subEvery,
		timeOnField,
		timeOnBench,
		playerSecondsEach,
		benchSecondsEach,
	} = subsPlan;

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
	};

	return (
		<div className="SubConfig page">
			<div className="page-title">Subs Settings</div>

			{numChanges !== 0 && (
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
						<b>{formatClock(subEvery)}</b> (
						<b>{pluralise(numChanges, "sub")}</b> per period.)
					</p>

					<p className="GameConfig-summary">
						Players will be <b>on for {formatClock(timeOnField)}</b>{" "}
						and <b>off for {formatClock(timeOnBench)}</b> at a time.
					</p>

					<p className="GameConfig-summary">
						In total, each player gets{" "}
						<b>{formatClock(playerSecondsEach)} on</b> and{" "}
						<b>{formatClock(benchSecondsEach)} off</b>.
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

			{numChanges === 0 && (
				<>
					<p className="GameConfig-summary">
						You don't have enough players to make subs.
					</p>
					<p className="GameConfig-summary">
						You may need to update your players or change the game
						settings.
					</p>

					<div className="BigButtons">
						<button
							onClick={() => navigateTo("PLAYERS")}
							className="BigButtons-button"
						>
							Edit Players
						</button>
						<button
							onClick={() => navigateTo("GAME SETTINGS")}
							className="BigButtons-button alt"
						>
							Configure Game
						</button>
					</div>
				</>
			)}
		</div>
	);
};

export default SubConfig;
