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
import NotEnoughPlayers from './NotEnoughPlayers';

const SubConfig = ({ navigateTo }) => {
	const players = useMemo(() => getActivePlayers(), []);
	const gameConfig = useMemo(() => getConfig("gameConfig"), []);
	const subsConfig = useMemo(() => getConfig("subsConfig"), []);

	const [playersPerSub, setPlayersPerSub] = useState(
		subsConfig.playersPerSub,
	);
	const [benchTurns, setBenchTurns] = useState(
		subsConfig.benchTurns,
	);
	const [hasChanged, setHasChanged] = useState(false);

	const subsPlan = useMemo(
		() =>
			calculateSubsPlan(players.length, gameConfig, {
				playersPerSub,
				benchTurns,
			}),
		[players.length, gameConfig, playersPerSub, benchTurns],
	);

	const reset = () => {
		setPlayersPerSub(subsConfig.playersPerSub);
		setBenchTurns(subsConfig.benchTurns);
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

	const noSubs = players.length <= numPlayersOn;

	const save = () => {
		saveConfig("subsConfig", {
			playersPerSub,
			benchTurns,
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

			{players.length >= numPlayersOn && (
				<>
					<ul className="GameConfig-list">
						<li className="GameConfig-list-item">
							<h3>Players changed each sub:</h3>
							<NumericInput
								min={noSubs ? 0 : 1}
								max={Math.max(numPlayers - numPlayersOn, noSubs ? 0 : 1)}
								value={noSubs ? 0 : playersPerSub}
								onChange={changeAndSet(setPlayersPerSub)}
								disabled={noSubs}
							/>
						</li>

						<li className="GameConfig-list-item">
							<h3>Turns on the bench:</h3>

							<NumericInput
								value={benchTurns}
								min={1}
								max={30}
								onChange={changeAndSet(setBenchTurns)}
								disabled={noSubs}
							/>
						</li>
					</ul>

					{noSubs ? (
						<Card variant="plain">
							<Typography level="body-md">
								You have enough active players for a game, but you don't have enough active players to have anybody on the bench, so you won't be able to make subs.
							</Typography>
							<Typography level="body-md">
								To change this, either add active players or modify the game setup.
							</Typography>
						</Card>
					) : (
						<>
							<p className="GameConfig-summary">
								Every{" "}<b>{formatClock(subEvery)}</b> we'll sub <b>{pluralise(playersPerSub, "player")}</b>, for a total of{" "}														
								<b>{pluralise(numChanges, "sub")}</b> per period.
							</p>

							<p className="GameConfig-summary">
								Players will have{" "}<b>{pluralise(benchTurns, "turn")}</b>{" "} on the bench per period, for{" "}<b>{formatClock(timeOnBench)}</b> at a time.
								They'll be on the field for a minimum of{" "}<b>{formatClock(timeOnField)}</b>.
							</p>

							<p className="GameConfig-summary">
								In total, each player gets{" "}
								<b>{formatClock(playerSecondsEach)} on</b> and{" "}
								<b>{formatClock(benchSecondsEach)} off</b>.
							</p>

							<SaveButtons {...{hasChanged, save, reset }} />
						</>
					)}
				</>
			)}

			{players.length < numPlayersOn && (
				<NotEnoughPlayers navigateTo={navigateTo} />
			)}
	</Sheet>
	);
};

export default SubConfig;
