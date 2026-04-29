import { useState } from "react";

import { IoPlay, IoPause, IoRefreshCircle } from "react-icons/io5";
import Card from "@mui/joy/Card";
import Sheet from "@mui/joy/Sheet";
import Grid from "@mui/joy/Grid";
import ButtonGroup from "@mui/joy/ButtonGroup";
import IconButton from "@mui/joy/IconButton";
import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";

import "./Timer.css";
import { formatClock } from "./util";
import { stopSound } from "./sound";

const Timer = ({
	clockTime,
	periodLengthSeconds,
	toggleClock,
	resetClock,
	clockRunning,
	currentPeriod,
	numPeriods,
	subTimes,
}) => {
	// we could hide the buttons by default so you don't push them by mistake
	const [showButtons, setShowButtons] = useState(true);

	return (
		<Sheet sx={{ p: 2 }}>
			<Card variant="outlined">
				<Grid
					container
					spacing={2}
					columns={12}
					sx={{ flexGrow: 1, justifyContent: "space-between" }}
				>
					<Grid size="5">
						<Typography>Game Clock</Typography>
						<Typography level="h1" color="primary">
							{formatClock(periodLengthSeconds - clockTime)}
						</Typography>
					</Grid>

					<Grid size={2}>
						<ButtonGroup orientation="vertical">
							<IconButton
								variant="outlined"
								onClick={() => {
									if (!clockRunning) setShowButtons(false);
									toggleClock();
								}}
							>
								{clockRunning ? <IoPause /> : <IoPlay />}
							</IconButton>
							<IconButton variant="outlined" onClick={resetClock}>
								<IoRefreshCircle />
							</IconButton>
						</ButtonGroup>
					</Grid>
					
					{/*<Divider orientation="vertical" />*/}
					
					<Grid size={5}>
						<Typography  sx={{
							textAlign: 'right'
						}}>Next Sub</Typography>
						<Typography level="h1">
							{formatClock(subTimes[0] - clockTime)}
						</Typography>
					</Grid>
				</Grid>
				{/*<Divider />*/}
				<Grid container>					
				</Grid>
			</Card>
		</Sheet>
	);
};

export default Timer;

/**
 * 
				<button
					onClick={() => {
						stopSound();
						setShowButtons(!showButtons);
					}}
					className="Timer-face-clock"
				>
					{formatClock(periodLengthSeconds - clockTime)}
				</button>
				<p className="Timer-face-periods">
					{currentPeriod} / {numPeriods}
				</p>
			</Card>

			
			<div className={`Timer-buttons ${showButtons ? "" : "hidden"}`}>
				
			</div>
		</Sheet>

		*/
