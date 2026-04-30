import { useState, useEffect, useRef } from "react";

import { IoPlay, IoPause, IoRefreshCircle, IoLockClosed } from "react-icons/io5";
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
	const [showButtons, setShowButtons] = useState(!clockRunning);
	const timerRef = useRef(null);

	const revealButtons = () => {
		setShowButtons(true);
		if (timerRef.current) clearTimeout(timerRef.current);
		timerRef.current = setTimeout(() => setShowButtons(false), 5000);
	};

	useEffect(() => {
		return () => { if (timerRef.current) clearTimeout(timerRef.current); };
	}, []);

	return (
		<Sheet variant="soft" sx={{ p: 2, paddingBottom: 4 }}>
			<Card variant="outlined">
				<Grid
					container
					spacing={2}
					columns={12}
					sx={{ flexGrow: 1, justifyContent: "space-between" }}
				>
					<Grid xs={5}>
						<Typography>Game Clock</Typography>
						<Typography level="h1" color="primary" sx={{ fontVariantNumeric: 'tabular-nums', textAlign: 'left' }}>
							{formatClock(periodLengthSeconds - clockTime)}
						</Typography>
					</Grid>

					<Grid xs={2}>
						{clockRunning && !showButtons ? (
							<IconButton variant="outlined" onClick={revealButtons}>
								<IoLockClosed />
							</IconButton>
						) : (
							<ButtonGroup orientation="vertical">
								<IconButton
									variant="outlined"
									onClick={() => {
										if (!clockRunning) {
											setShowButtons(false);
											if (timerRef.current) clearTimeout(timerRef.current);
										}
										toggleClock();
									}}
								>
									{clockRunning ? <IoPause /> : <IoPlay />}
								</IconButton>
								{!clockRunning && (
									<IconButton variant="outlined" onClick={resetClock}>
										<IoRefreshCircle />
									</IconButton>
								)}
							</ButtonGroup>
						)}
					</Grid>
					
					<Grid xs={5}>
						<Typography  sx={{
							textAlign: 'right'
						}}>Next Sub</Typography>
						<Typography level="h1" sx={{ fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>
							{subTimes.length ? formatClock(subTimes[0] - clockTime) : "N/A"}
						</Typography>
					</Grid>
				</Grid>
				<Grid container>					
				</Grid>
			</Card>
		</Sheet>
	);
};

export default Timer;
