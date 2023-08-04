import { useState } from "react";

import "./NextSub.css";

import { formatClock } from "./util";

const NextSub = ({
	clockTime,
	subTimes,
}) => {
	const [expanded, setExpanded] = useState(false);

	return (
		<div className={`NextSub ${expanded ? 'expanded' : ''}`}>
			<h3 className="NextSub-title">Next sub:</h3>
			<ul className="NextSub-list">
				{subTimes.slice(0, 3).map((time) => (
					<li
						key={time}
						className={`Sub-time ${
							clockTime > time ? "overdue" : ""
						}`}
					>
						<button onClick={() => setExpanded(!expanded)}>
							{formatClock(time - clockTime)}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default NextSub;
