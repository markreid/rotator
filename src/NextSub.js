import { useState } from "react";

import "./NextSub.css";

import { formatClock, getConfig } from "./util";

const Sub = ({ on, off, time, clockTime, makeSub, index }) => (
	<div className="Sub">
		<div className="Sub-on">{on}</div>
		<button className="Sub-button" onClick={() => makeSub(index, on, off)}>
			🔁
		</button>
		<div className="Sub-off">{off}</div>

		<div className={`Sub-time ${clockTime > time ? "overdue" : ""}`}>
			{formatClock(time - clockTime)}
		</div>
	</div>
);

const NextSub = ({
	players,
	subsPerChange,
	subMultiplier,
	clockTime,
	subs,
	makeSub,
}) => {
	const [showMore, setShowMore] = useState(false);
	const numSubsVisible = showMore ? subs.length : subsPerChange;

	const { numPlayersOn } = getConfig("gameSettings", {});

	const subsWithPlayers = subs.map((time, i) => {
		const off = players[i % players.length];
		const on = players[(i + numPlayersOn) % players.length];

		return {
			time,
			off,
			on,
		};
	});

	return (
		<div className="NextSub">
			{subsWithPlayers.slice(0, numSubsVisible).map((sub, i) => (
				<Sub
					key={`${sub.on}${sub.time}`}
					{...sub}
					index={i}
					clockTime={clockTime}
					makeSub={makeSub}
				/>
			))}
			<button
				className="NextSub-showmore"
				onClick={() => setShowMore(!showMore)}
			>
				Show {showMore ? "less" : "more"}
			</button>
		</div>
	);
};

export default NextSub;
