import { useState, useMemo } from "react";

import Sheet from "@mui/joy/Sheet";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import IconButton from "@mui/joy/IconButton";
import ButtonGroup from "@mui/joy/ButtonGroup";

import NumericInput from "./NumericInput";

import "./GameConfig.css";

import { pluralise } from "./util";
import { getConfig, saveConfig } from "./configs";

const PERIOD_NAMES = ["periods", "period", "halves", "thirds", "quarters"];

const GameConfig = ({ subMultiplier, setSubMultiplier }) => {
	const gameConfig = useMemo(() => getConfig("gameConfig"), []);

	const [numPeriods, setNumPeriods] = useState(gameConfig.numPeriods);
	const [numPlayersOn, setNumPlayersOn] = useState(gameConfig.numPlayersOn);
	const [periodLengthMinutes, setPeriodLengthMinutes] = useState(
		gameConfig.periodLengthMinutes,
	);

	const [hasChanged, setHasChanged] = useState(false);

	const resetFromSaved = () => {
		setNumPeriods(gameConfig.numPeriods);
		setNumPlayersOn(gameConfig.numPlayersOn);
		setPeriodLengthMinutes(gameConfig.periodLengthMinutes);
		setHasChanged(false);
	};

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
		<Sheet>
			<Card variant="plain">
				<Typography level="h1">Game Setup</Typography>
			</Card>
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
					{numPeriods} {PERIOD_NAMES[numPeriods] || "periods"} of{" "}
					{periodLengthMinutes} minutes
				</b>{" "}
				each.
			</p>
			<p className="GameConfig-summary">
				There will be <b>{pluralise(numPlayersOn, "player")} on</b> at a
				time.
			</p>

			<Card variant="plain">
			<ButtonGroup>
				<Button
					variant="soft"
					color="primary"
					disabled={!hasChanged}
					onClick={saveToConfig}
				>
					SAVE
				</Button>
				<Button
					variant="soft"
					color="danger"
					disabled={!hasChanged}
					onClick={resetFromSaved}
				>
					RESET
				</Button>
			</ButtonGroup>
			</Card>
			
		</Sheet>
	);
};

export default GameConfig;
