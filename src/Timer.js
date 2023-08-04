import { useState } from "react";

import "./Timer.css";
import { formatClock } from "./util";
import { stopSound } from './sound';

const Timer = ({
	clockTime,
	periodLengthSeconds,
	toggleClock,
	resetClock,
	clockRunning,
	currentPeriod,
	numPeriods,
}) => {
	// we could hide the buttons by default so you don't push them by mistake
	const [showButtons] = useState(true);

	return (
		<div className="Timer">
			<div className="Timer-face">
			<button onClick={stopSound} className="Timer-face-clock">
				{formatClock(periodLengthSeconds - clockTime)}				
			</button>
			<p className="Timer-face-periods">{currentPeriod} / {numPeriods}</p>
			</div>

			{showButtons ? (
				<div className="Timer-buttons">
					<button className="Timer-button" onClick={toggleClock}>
						{clockRunning ? "⏸" : "▶️"}
					</button>
					<button className="Timer-button" onClick={resetClock}>
						🔁
					</button>
				</div>
			) : null}
		</div>
	);
};

export default Timer;
