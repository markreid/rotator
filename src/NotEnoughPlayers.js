import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";

const NotEnoughPlayers = ({ navigateTo }) => (
	<Card variant="plain">
		<Typography level="body-md">
			You haven't got enough active players to start a game. 
		</Typography>
		<Typography level="body-md">
			You may need to update your players or change the game settings.
		</Typography>
		<Stack spacing={1} sx={{ mt: 1 }}>
			<Button variant="soft" color="primary" onClick={() => navigateTo("PLAYERS")}>
				Edit Players
			</Button>
			<Button variant="soft" color="neutral" onClick={() => navigateTo("GAME SETTINGS")}>
				Configure Game
			</Button>
		</Stack>
	</Card>
);

export default NotEnoughPlayers;
