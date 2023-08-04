import { useState } from 'react';

import './ProgressBar.css';

import { formatClock } from './util';

const ProgressBar = ({ variant, val = 0, target = 1 }) => {
	const percentage = Math.round((val / target) * 100);

	const [elapsedMode, setElapsedMode] = useState(true);

	return (
		<div className={`ProgressBar ${variant}`}>
			<div
				className="ProgressBar-inner"
				style={{
					width: `${Math.min(percentage, 100)}%`,
				}}
			/>
			<div
				className="ProgressBar-inner-over"
				style={{
					width: `${Math.max(percentage - 100, 0)}%`,
				}}
			/>
			<div className="ProgressBar-label">
				<button
					onClick={() => setElapsedMode(!elapsedMode)}
					className="ProgressBar-label-button"
				>
					{elapsedMode ? (
						formatClock(val)
					) : (
						`${target - val > 0 ? '-' : '+'}${formatClock(Math.abs(target - val))}`
					)}					
				</button>
			</div>
		</div>
	);
};

export default ProgressBar;