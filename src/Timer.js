import { useState } from 'react';

import { leadingZero, formatClock } from './util';

import './Timer.css';




const Timer = ({ clockTime, periodLength, toggleClock, resetClock, clockRunning }) => {

	// toggle between display modes
	// either show the timer going up, or the time remaining
	const [remainingMode, setRemainingMode] = useState(true);
	const toggleMode = () => setRemainingMode((mode) => !mode);

	// hide the buttons by default so you don't push them by mistake
	const [showButtons, setShowButtons] = useState(true);

	return (
		<div className="timer">
			<button onClick={toggleMode} className="timer-face">
				{formatClock(remainingMode ? periodLength - clockTime : clockTime)}
			</button>
			
			{showButtons ? (
				<div className="timer-buttons">
					<button className="timer-button" onClick={toggleClock}>{clockRunning ? '⏸' : '▶️' }</button>
      				<button className="timer-button" onClick={resetClock}>🔁</button>
      			</div>) 
			: null}			
		</div>
	);
};

export default Timer;