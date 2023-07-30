import './PlayerList.css';

const PlayerList = ({ players, title }) => (
	<div className="PlayerList">
		<h2 className="PlayerList-title">{title}</h2>
		<ul className="PlayerList-list">
			{players.map((player) => (
				<li key={player} className="PlayerList-list-item">{player}</li>
			))}
		</ul>
	</div>
);

export default PlayerList;