import Card from "@mui/joy/Card";
import Button from "@mui/joy/Button";

const SaveButtons = ({ hasChanged, save, reset}) => (
	<Card variant="plain">
		<Button
			size="md"
			disabled={!hasChanged}
			onClick={save}
			color="success"
		>
			SAVE
		</Button>
		<Button
			size="md"
			disabled={!hasChanged}
			onClick={reset}
			color="danger"
		>
			RESET
		</Button>
	</Card>
);

export default SaveButtons;