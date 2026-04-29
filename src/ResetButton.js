import { useState } from "react";

import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";

import { resetAll } from "./configs";

const reset = () => {
	resetAll();
	document.location.reload();
};

const ResetButton = () => {
	const [hasReset, setHasReset] = useState(false);

	return (
		<Stack spacing={1.5} sx={{ p: 1.5 }}>
			<Button
				variant="soft"
				color="neutral"
				onClick={() => document.location.reload()}
			>
				Restart
			</Button>
			<Button
				variant="soft"
				color="danger"
				disabled={hasReset}
				onClick={() => {
					reset();
					setHasReset(true);
				}}
			>
				Reset All Settings
			</Button>
		</Stack>
	);
};

export default ResetButton;
