import { useState } from "react";

import Sheet from "@mui/joy/Sheet";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import IconButton from "@mui/joy/IconButton";
import ButtonGroup from "@mui/joy/ButtonGroup";
import FormControl from "@mui/joy/FormControl";
import Divider from "@mui/joy/Divider";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListDivider from "@mui/joy/ListDivider";
import {
	IoPersonAdd,
	IoPersonCircle,
	IoBackspaceOutline,
	IoShuffle
} from "react-icons/io5";

import { pluralise, shuffle } from "./util";
import { getConfig, saveConfig } from "./configs";

import "./PlayerConfig.css";

const PlayerConfig = () => {
	const [players, setPlayers] = useState(() => getConfig("players"));
	const [newPlayerName, setNewPlayerName] = useState("");
	const [hasChanged, setHasChanged] = useState(false);

	const submitHandler = (evt) => {
		evt.preventDefault();

		const trimmed = newPlayerName.trim();
		// don't add empty values
		if (!trimmed) return;

		// add the player (if not already there) and reset the form
		const newPlayers = Array.from(new Set(players.concat([trimmed])));
		setPlayers(newPlayers);
		setNewPlayerName("");
		setHasChanged(true);
	};

	const removePlayer = (name) => {
		const newPlayers = players.filter((player) => name !== player);
		setPlayers(newPlayers);
		setHasChanged(true);
	};

	const shufflePlayers = () => {
		setPlayers(shuffle(players));
		setHasChanged(true);
	};

	const save = () => {
		saveConfig("players", players);
		setHasChanged(false);
	};

	const reset = () => {
		setPlayers(getConfig("players"));
		setHasChanged(false);
	};

	return (
		<Sheet>
			<Card variant="plain">
				<Typography level="h1">Players</Typography>
				<Divider />
				<form onSubmit={submitHandler}>
					<FormControl>
						<Input
							sx={{ "--Input-decoratorChildHeight": "35px" }}
							endDecorator={
								<IconButton
									type="submit"
									variant="soft"
									color="primary"
									sx={{
										borderTopLeftRadius: 0,
										borderBottomLeftRadius: 0,
									}}
								>
									<IoPersonAdd size="1.4rem" />
								</IconButton>
							}
							type="text"
							value={newPlayerName}
							onChange={({ target }) =>
								setNewPlayerName(target.value)
							}
							placeholder="Player Name"
						/>
					</FormControl>
				</form>
			</Card>

			<List>
				{players.map((name) => (
					<>
						<ListDivider />
						<ListItem
							key={name}
							endAction={
								<IconButton
									aria-label="Remove"
									size="sm"
									onClick={() => removePlayer(name)}
								>
									<IoBackspaceOutline size="1.3rem" />
								</IconButton>
							}
						>
							<ListItemDecorator>
								<IoPersonCircle size="1.4rem" color="grey" />
							</ListItemDecorator>
							<ListItemContent>{name}</ListItemContent>
						</ListItem>
					</>
				))}
			</List>

			<Card variant="plain">
				Total: {pluralise(players.length, "player")}
				<Button
					startDecorator={
						<IoShuffle size="24" />
					}
					variant="outlined"
					color="neutral"
					onClick={shufflePlayers}
				>
					SHUFFLE
				</Button>
			</Card>

			<Card variant="plain">
				<Button disabled={!hasChanged} onClick={save} color="success">
					SAVE
				</Button>
				<Button disabled={!hasChanged} onClick={reset} color="danger">
					RESET
				</Button>
			</Card>
		</Sheet>
	);
};

export default PlayerConfig;
