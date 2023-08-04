import './GameHistory.css';

import { formatClock } from './util';


const GameHistory = ({ subs }) => (
	<div className="GameHistory">
		<h2 className="GameHistory-title">Game Subs</h2>
		<p className="GameHistory-starters">
			Starting: {subs[0].on.join(", ")}
		</p>
		<p className="GameHistory-starters">Bench: {subs[0].off.join(", ")}</p>

		<ul className="GameHistory-list">
			{subs.slice(1).map((sub) => (
				<li className="GameHistory-list-item">
					<b>{sub.on.slice(-sub.numChanges).join(", ")}</b> ↔️{" "}
					<b>{sub.off.slice(-sub.numChanges).join(", ")}</b> @{" "}
					<b>{formatClock(sub.clockTime)}</b>
				</li>
			))}
		</ul>
	</div>
);

export default GameHistory;