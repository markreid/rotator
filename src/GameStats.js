import "./GameStats.css";

import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListDivider from "@mui/joy/ListDivider";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";

import GameHistory from './GameHistory';
import ProgressBar from "./ProgressBar";

import { calculateSpellCounts } from './util';

const GameStats = ({
	subs,
	players,
	clockTime,
	numPlayersOn,
	playerSecondsEach,
	benchSecondsEach,
	timeOnBench,
	timeOnField,
	timeOn,
}) => {
	const spellCounts = calculateSpellCounts(subs, players);

	return (
		<>
		<List>
			{players.map((player, i) => (
				<Box key={player}>
					{i > 0 && <ListDivider />}
					<ListItem sx={{ display: "block", py: 0.75, px: 1.5 }}>
						<Typography level="body-sm" fontWeight="md" sx={{ mb: 0.5 }}>
							{player} <span style={{ color: '#aaa', fontSize: '0.85em' }}>({spellCounts[player].on} on, {spellCounts[player].off} off)</span>
						</Typography>
						<ProgressBar
							variant="on"
							val={timeOn[player].on}
							target={playerSecondsEach}
						/>
						<ProgressBar
							variant="off"
							val={timeOn[player].off}
							target={benchSecondsEach}
						/>
					</ListItem>
				</Box>
			))}
		</List>
		{/*<GameHistory subs={subs} />*/}
		</>
	);
};

export default GameStats;
