import { useRef } from "react";

import "./PlayerList.css";

import ProgressBar from "./ProgressBar";

import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListSubheader from "@mui/joy/ListSubheader";
import {
	IoArrowForward,
	IoArrowBack,
	IoArrowForwardCircle,
	IoArrowBackCircle,
	IoHandRightOutline,
	IoLockClosed,
} from "react-icons/io5";

import { getDevMode } from "./AppConfig";
import { calculateShouldStay } from "./util";

// hold a player this long to fix/unfix them (pinning is rare, so there's no
// always-visible control — see the long-press handlers below).
const LONG_PRESS_MS = 2000;

const PlayerList = ({
	players,
	variant,
	className,
	selected,
	select,
	timeOn,
	targetTimeOn,
	targetTotalTime,
	inverseTotalTime,
	stayThreshold,
	subTimes,
	nextSubWarning,
	playersPerSub,
	clockTime,
	subs,
	fixed = [],
	toggleFixed = () => {},
}) => {
	const devMode = getDevMode();

	// long-press (hold ~2s) a player to fix/unfix them. a single timer is
	// enough since only one row can be pressed at a time. we swallow the click
	// that follows a fired long-press, and cancel if the finger moves (scroll).
	const pressTimer = useRef(null);
	const pressFired = useRef(false);
	const pressStart = useRef({ x: 0, y: 0 });

	const startPress = (player, e) => {
		pressFired.current = false;
		pressStart.current = { x: e.clientX, y: e.clientY };
		pressTimer.current = setTimeout(() => {
			pressFired.current = true;
			toggleFixed(player);
		}, LONG_PRESS_MS);
	};
	const movePress = (e) => {
		const dx = Math.abs(e.clientX - pressStart.current.x);
		const dy = Math.abs(e.clientY - pressStart.current.y);
		if (dx > 10 || dy > 10) clearTimeout(pressTimer.current);
	};
	const endPress = () => clearTimeout(pressTimer.current);
	const handleSelect = (player) => {
		if (pressFired.current) {
			pressFired.current = false; // consume the post-long-press click
			return;
		}
		select(player);
	};

	const timeOnReference = variant === "on" ? "lastOn" : "lastOff";
	const nextSubTime = subTimes.find((t) => t >= clockTime);
	const pastSubTime = subTimes.length > 0 && subTimes[0] < clockTime;
	const withinWarning =
		pastSubTime ||
		(nextSubTime != null &&
			nextSubWarning > 0 &&
			nextSubTime - clockTime <= nextSubWarning);

	// fixed players never get suggested for a sub
	const suggestedPlayers = withinWarning
		? players
				.slice()
				.filter((p) => !fixed.includes(p))
				.sort(
					(a, b) =>
						timeOn[a][timeOnReference] - timeOn[b][timeOnReference],
				)
				.slice(0, playersPerSub)
		: [];

	const inverseVariant = variant === "on" ? "off" : "on";

	const sortedPlayers = players.slice().sort((a, b) => {
		// fixed (parked) players sink to the bottom of the list.
		const aFixed = fixed.includes(a) ? 1 : 0;
		const bFixed = fixed.includes(b) ? 1 : 0;
		if (aFixed !== bFixed) return aFixed - bFixed;
		// then put the players with shouldStay:true at the bottom.
		const aShouldStay = calculateShouldStay(
			inverseTotalTime,
			timeOn[a][inverseVariant],
			stayThreshold,
		);
		const bShouldStay = calculateShouldStay(
			inverseTotalTime,
			timeOn[b][inverseVariant],
			stayThreshold,
		);
		return aShouldStay - bShouldStay;
	});
	// the first fixed player marks the start of the "parked" group
	const firstFixedIndex = sortedPlayers.findIndex((p) => fixed.includes(p));

	return (
		<div className={`PlayerList ${variant}`}>
			<List>
				<ListSubheader>{className}</ListSubheader>
				{sortedPlayers.map((player, index) => {
						const isFixed = fixed.includes(player);
						const isSelected = selected.includes(player);

						// calc % of time in this state for the current spell only
						const percentageThisSpell = Math.round(
							((clockTime - timeOn[player][timeOnReference]) /
								targetTimeOn) *
								100,
						);

						// calc % of time in this state for the total game
						const percentageTotal = Math.round(
							(timeOn[player][variant] / targetTotalTime) * 100,
						);

						const shouldStay = calculateShouldStay(
							inverseTotalTime,
							timeOn[player][inverseVariant],
							stayThreshold,
						);

						return (
							<ListItem
								key={player}
								sx={{
									paddingRight: "1px",
									paddingBlock: "4px",
									borderBottom: "1px solid rgba(0,0,0,0.06)",
									// separate the parked group from active players
									...(index === firstFixedIndex && index > 0
										? {
												borderTop:
													"3px solid rgba(0,0,0,0.25)",
											}
										: {}),
								}}
							>
								<ListItemButton
									selected={isSelected}
									onClick={() => handleSelect(player)}
									onPointerDown={(e) => startPress(player, e)}
									onPointerMove={movePress}
									onPointerUp={endPress}
									onPointerLeave={endPress}
									onContextMenu={(e) => e.preventDefault()}
									sx={{
										userSelect: "none",
										"&&:hover": {
											backgroundColor: isSelected
												? variant === "on"
													? "var(--offlight)"
													: "var(--onlight)"
												: "transparent",
										},
										...(isSelected
											? {
													"&&": {
														backgroundColor:
															variant === "on"
																? "var(--offlight)"
																: "var(--onlight)",
													},
												}
											: {}),
									}}
								>
									{isFixed && (
										<IoLockClosed
											color="var(--c4)"
											size="1.1em"
											style={{
												marginRight: "6px",
												flexShrink: 0,
											}}
										/>
									)}
									<span style={{ flex: 1 }}>
										{player}
										{devMode && (
											<span
												style={{
													color: "#aaa",
													marginLeft: "4px",
													fontSize: "0.8em",
												}}
											>
												{percentageThisSpell}% -{" "}
												{percentageTotal}%
											</span>
										)}
									</span>
									{/* fixed players show no sub indicator — they're parked */}
									{isFixed ? null : shouldStay ? (
										<IoHandRightOutline
											color="var(--c4)"
											size="1.2em"
										/>
									) : percentageTotal > 100 ? (
										variant === "on" ? (
											<IoArrowForwardCircle
												color="var(--off)"
												size="1.2em"
											/>
										) : (
											<IoArrowBackCircle
												color="var(--on)"
												size="1.2em"
											/>
										)
									) : suggestedPlayers.includes(player) ? (
										variant === "on" ? (
											<IoArrowForward
												color="var(--off)"
												size="1.2em"
											/>
										) : (
											<IoArrowBack
												color="var(--on)"
												size="1.2em"
											/>
										)
									) : null}
								</ListItemButton>

								{!isFixed && (
									<ProgressBar
										variant={`${variant} slim`}
										val={
											clockTime -
											timeOn[player][timeOnReference]
										}
										target={targetTimeOn}
									/>
								)}
							</ListItem>
						);
					})}
			</List>
		</div>
	);
};

export default PlayerList;
