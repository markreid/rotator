import "./GameStats.css";

import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListDivider from "@mui/joy/ListDivider";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";

import GameHistory from './GameHistory';
import ProgressBar from "./ProgressBar";
import { IoLockClosed } from "react-icons/io5";

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
	fixed = [],
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
							{fixed.includes(player) && (
								<IoLockClosed color="var(--c4)" size="0.9em" style={{ marginRight: 2, verticalAlign: "middle" }} />
							)}
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
