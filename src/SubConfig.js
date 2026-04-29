import { useState, useMemo } from "react";

import Sheet from "@mui/joy/Sheet";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import IconButton from "@mui/joy/IconButton";
import ButtonGroup from "@mui/joy/ButtonGroup";

import "./SubConfig.css";
import { pluralise, formatClock, calculateSubsPlan } from "./util";

import { getConfig, saveConfig, getActivePlayers } from "./configs";

import NumericInput from "./NumericInput";
import SaveButtons from './SaveButtons';

const SubConfig = ({ navigateTo }) => {
	const players = useMemo(() => getActivePlayers(), []);
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

	const reset = () => {
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

	const save = () => {
		saveConfig("subsConfig", {
			playersPerSub,
			subMultiplier,
		});
		setHasChanged(false);
		// reset();
	};

	// call a state setter function and flag hasChanged as true
	const changeAndSet = (setter) => (val) => {
		setter(val);
		setHasChanged(true);
	};

	return (
		<Sheet>
		<Card variant="plain">
		<Typography level="h1">Subs Setup</Typography>
		</Card>		

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

					
					<SaveButtons {...{hasChanged, save, reset }} />					
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
	</Sheet>
	);
};

export default SubConfig;
