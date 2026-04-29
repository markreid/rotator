import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import ButtonGroup from "@mui/joy/ButtonGroup";

const SaveButtons = ({ hasChanged, save, reset }) => (
	<Box
		sx={{
			position: "sticky",
			bottom: 0,
			p: 1.5,
			backgroundColor: "background.surface",
			borderTop: "1px solid",
			borderColor: "divider",
			zIndex: 5,
		}}
	>
		<ButtonGroup sx={{ width: "100%" }}>
			<Button
				variant="soft"
				color="primary"
				disabled={!hasChanged}
				onClick={save}
				sx={{ flex: 1 }}
			>
				SAVE
			</Button>
			<Button
				variant="soft"
				color="danger"
				disabled={!hasChanged}
				onClick={reset}
				sx={{ flex: 1 }}
			>
				RESET
			</Button>
		</ButtonGroup>
	</Box>
);

export default SaveButtons;
