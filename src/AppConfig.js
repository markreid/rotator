import { useState, useEffect } from "react";

import Sheet from "@mui/joy/Sheet";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Checkbox from "@mui/joy/Checkbox";
import Stack from "@mui/joy/Stack";

import ResetButton from "./ResetButton";

export const getDevMode = () =>
	JSON.parse(localStorage.getItem("rotator.devMode")) || false;

const AppConfig = ({ onDevModeChange }) => {
	const [workerWaiting, setWorkerWaiting] = useState(false);
	const [devMode, setDevMode] = useState(getDevMode);

	useEffect(() => {
		if (!("serviceWorker" in navigator)) {
			setWorkerWaiting(null);
			return;
		}
		navigator.serviceWorker
			.getRegistration()
			.then((registration) => {
				if (!registration) return setWorkerWaiting(null);
				if (registration.waiting) return setWorkerWaiting(registration.waiting);
				registration.update().then(() => {
					setWorkerWaiting(registration.waiting || null);
				});
			})
			.catch(() => {
				setWorkerWaiting(null);
			});
	}, []);

	const toggleDevMode = () => {
		const next = !devMode;
		setDevMode(next);
		localStorage.setItem("rotator.devMode", JSON.stringify(next));
		onDevModeChange(next);
	};

	return (
		<Sheet>
			<Card variant="plain">
				<Typography level="h1">App Config</Typography>
			</Card>

			<Card variant="plain">
				<Typography level="title-lg">Reset</Typography>
			</Card>
			<Card variant="plain">
				<Typography level="body-md">
					Restart the app or reset all settings below.
				</Typography>
			</Card>
			<ResetButton />
			
			<Card variant="plain">
				<Typography level="title-lg">Dev Mode</Typography>				
			</Card>
			<Stack spacing={1.5} sx={{ p: 1.5 }}>
				<Checkbox
					label="Development mode"
					checked={devMode}
					onChange={toggleDevMode}
				/>
			</Stack>

			<Card variant="plain">
				<Typography level="title-lg">Update App</Typography>
			</Card>
			<Stack spacing={1.5} sx={{ p: 1.5 }}>
				<Button
					variant="soft"
					color="neutral"
					disabled={!workerWaiting}
					onClick={() => {
						navigator.serviceWorker
							.getRegistration()
							.then((reg) => {
								reg.waiting.postMessage({
									type: "SKIP_WAITING",
								});

								setWorkerWaiting(false);

								document.location.reload();
							});
					}}
				>
					{workerWaiting === false && "Checking for updates"}
					{workerWaiting === null && "No updates found"}
					{!!workerWaiting && "Update now"}
				</Button>
			</Stack>
		</Sheet>
	);
};

export default AppConfig;
