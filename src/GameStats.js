import "./GameStats.css";

import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListDivider from "@mui/joy/ListDivider";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";

import ProgressBar from "./ProgressBar";

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
	return (
		<List>
			{players.map((player, i) => (
				<Box key={player}>
					{i > 0 && <ListDivider />}
					<ListItem sx={{ display: "block", py: 0.75, px: 1.5 }}>
						<Typography level="body-sm" fontWeight="md" sx={{ mb: 0.5 }}>
							{player}
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
	);
};

export default GameStats;
