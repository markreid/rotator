import "./PlayerList.css";

const PlayerList = ({ players, selected, select, className = ''}) => {
	return (
		<div className={`PlayerList ${className}`}>
			<ul className="PlayerList-list">
				{players.map((player) => {
					const isSelected = selected.includes(player);
					return (
						<li key={player} className={`PlayerList-list-item ${isSelected ? 'selected' : ''}`}>
							<button className="PlayerList-list-item-button" onClick={() => select(player)}>{player}</button>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default PlayerList;
