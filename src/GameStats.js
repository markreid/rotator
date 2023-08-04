import "./GameStats.css";

import ProgressBar from './ProgressBar';

const GameStats = ({
	subs,
	players,
	clockTime,
	numPlayersOn,
	playerSecondsEach,
	benchSecondsEach,
	timeOnBench,
	timeOnField,
	timeOn,
}) => {
	

	return (
		<div className="GameStats">
			<ul className="GameStats-list">
				{players.map((player) => (
					<li className="GameStats-list-item" key={player}>
						<h3 className="GameStats-list-item-player">{player}</h3>

						<ProgressBar
							variant="on"
							val={timeOn[player].on}
							target={playerSecondsEach}
						/>

						<ProgressBar
							variant="off"
							val={timeOn[player].off}
							target={benchSecondsEach}
						/>				
					</li>
				))}
			</ul>
		</div>
	);
};

export default GameStats;
