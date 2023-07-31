import { useState } from "react";

import "./NextSub.css";

import { formatClock } from "./util";

const NextSub = ({
	clockTime,
	subTimes,
}) => {
	const [showMore, setShowMore] = useState(false);

	return (
		<div className="NextSub">
			<h3 className="NextSub-title">Next sub:</h3>
			<ul className="NextSub-list">
				{subTimes.slice(0, showMore ? 3 : 1).map((time) => (
					<li
						className={`Sub-time ${
							clockTime > time ? "overdue" : ""
						}`}
					>
						<button onClick={() => setShowMore(!showMore)}>
							{formatClock(time - clockTime)}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default NextSub;
