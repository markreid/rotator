import { useState } from 'react';

import './Timer.css';

// add a leading zero to single digits
export const leadingZero = (num) => num < 10 ? `0${num}` : num;

// format seconds to clock
export const format = (seconds) => `${leadingZero(Math.floor(seconds/60))}:${leadingZero(seconds%60)}`;

const Timer = ({ clockTime, periodLength, toggleClock, resetClock, clockRunning }) => {

	// toggle between display modes
	// either show the timer going up, or the time remaining
	const [remainingMode, setRemainingMode] = useState(true);
	const toggleMode = () => setRemainingMode((mode) => !mode);

	return (
		<div className="timer">
			<button onClick={toggleMode} className="timer-face">
				{format(remainingMode ? periodLength - clockTime : clockTime)}
			</button>
			
			<div className="timer-buttons">
				<button className="timer-button" onClick={toggleClock}>{clockRunning ? '⏸' : '▶️' }</button>
      			<button className="timer-button" onClick={resetClock}>🔁</button>
      		</div>
		</div>
	);
};

export default Timer;