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
	const [showButtons, setShowButtons] = useState(true);

	return (
		<div className="Timer">
			<div className="Timer-face">
			<button onClick={() => {
				stopSound();
				setShowButtons(!showButtons);
			}} className="Timer-face-clock">
				{formatClock(periodLengthSeconds - clockTime)}				
			</button>
			<p className="Timer-face-periods">{currentPeriod} / {numPeriods}</p>
			</div>

				<div className={`Timer-buttons ${showButtons ? '' : 'hidden'}`}>
					<button className="Timer-button" onClick={() => {
						if (!clockRunning) setShowButtons(false);
						toggleClock();
					}}>
						{clockRunning ? "⏸" : "▶️"}
					</button>
					<button className="Timer-button" onClick={resetClock}>
						🔁
					</button>
				</div>
		</div>
	);
};

export default Timer;
