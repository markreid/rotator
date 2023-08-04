import "./PlayerList.css";

import ProgressBar from './ProgressBar';

const PlayerList = ({ players, variant, selected, select, timeOn, targetTimeOn, clockTime}) => {

	
	const timeOnReference = variant === 'on' ? 'lastOn' : 'lastOff';

	return (
		<div className={`PlayerList ${variant}`}>
			<ul className="PlayerList-list">
				{players.map((player) => {
					const isSelected = selected.includes(player);
					return (
						<li
							key={player}
							className={`PlayerList-list-item ${
								isSelected ? "selected" : ""
							}`}
						>
							<button
								className="PlayerList-list-item-button"
								onClick={() => select(player)}
							>
								{player}
							</button>
							<ProgressBar
								variant={`${variant} slim`}
								val={clockTime - timeOn[player][timeOnReference]}
								target={targetTimeOn}
							/>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default PlayerList;
