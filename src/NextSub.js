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
	const [subsVisible, setSubsVisible] = useState(subsPerChange);
	
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
			{subsWithPlayers.slice(0, subsVisible).map((sub, i) => (
				<Sub
					key={`${sub.on}${sub.time}`}
					{...sub}
					index={i}
					clockTime={clockTime}
					makeSub={(...args) => {
						makeSub(...args);
						setSubsVisible(subsVisible <= 1 ? subsPerChange :subsVisible - 1);
					}}
				/>
			))}
			<button
				className="NextSub-showmore"
				onClick={() => setSubsVisible(subsVisible + subsPerChange)}
			>
				Show next
			</button>
		</div>
	);
};

export default NextSub;
