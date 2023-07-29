import { useState } from "react";

import "./Timer.css";
import { formatClock } from "./util";

const Timer = ({
	clockTime,
	periodLength,
	toggleClock,
	resetClock,
	clockRunning,
	currentPeriod,
	numPeriods,
}) => {
	// toggle between display modes
	// either show the timer going up, or the time remaining
	const [remainingMode, setRemainingMode] = useState(true);
	const toggleMode = () => setRemainingMode((mode) => !mode);

	// we could hide the buttons by default so you don't push them by mistake
	const [showButtons] = useState(true);

	return (
		<div className="timer">
			<div className="timer-face">
			<button onClick={toggleMode} className="timer-face-clock">
				{formatClock(
					remainingMode ? periodLength - clockTime : clockTime
				)}				
			</button>
			<p className="timer-face-periods">{currentPeriod} / {numPeriods}</p>
			</div>


			{showButtons ? (
				<div className="timer-buttons">
					<button className="timer-button" onClick={toggleClock}>
						{clockRunning ? "⏸" : "▶️"}
					</button>
					<button className="timer-button" onClick={resetClock}>
						🔁
					</button>
				</div>
			) : null}
		</div>
	);
};

export default Timer;
