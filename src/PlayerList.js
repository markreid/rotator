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
} from "react-icons/io5";

import { getDevMode } from "./AppConfig";
import { calculateShouldStay } from "./util";

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
}) => {
	const devMode = getDevMode();

	const timeOnReference = variant === "on" ? "lastOn" : "lastOff";
	const nextSubTime = subTimes.find((t) => t >= clockTime);
	const pastSubTime = subTimes.length > 0 && subTimes[0] < clockTime;
	const withinWarning =
		pastSubTime ||
		(nextSubTime != null &&
			nextSubWarning > 0 &&
			nextSubTime - clockTime <= nextSubWarning);

	const suggestedPlayers = withinWarning
		? players
				.slice()
				.sort(
					(a, b) =>
						timeOn[a][timeOnReference] - timeOn[b][timeOnReference],
				)
				.slice(0, playersPerSub)
		: [];

	const inverseVariant = variant === "on" ? "off" : "on";

	return (
		<div className={`PlayerList ${variant}`}>
			<List>
				<ListSubheader>{className}</ListSubheader>
				{players
					.slice()
					.sort((a, b) => {
						// put the players with shouldStay:true at the bottom.
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
					})
					.map((player) => {
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
								}}
							>
								<ListItemButton
									selected={isSelected}
									onClick={() => select(player)}
									sx={{
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
									{shouldStay ? (
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

								<ProgressBar
									variant={`${variant} slim`}
									val={
										clockTime -
										timeOn[player][timeOnReference]
									}
									target={targetTimeOn}
								/>
							</ListItem>
						);
					})}
			</List>
		</div>
	);
};

export default PlayerList;
