import { useState } from 'react';

import { getConfig, saveConfig, pluralise } from './util';

import './PlayerConfig.css';

const PlayerConfig = () => {

	const [players, setPlayers] = useState(getConfig('players', []));

	const [newPlayerName, setNewPlayerName] = useState('');	

	const submitHandler = (evt) => {
		evt.preventDefault();
		const trimmed = newPlayerName.trim();
		// don't add empty values
		if (!trimmed) return;		
		
		// add the player (if not already there)
		// save to localSotrage
		// reset the form
		const newPlayers = Array.from(new Set(players.concat([trimmed])));
		setPlayers(newPlayers);
		saveConfig('players', newPlayers);
		setNewPlayerName('');
	}

	const removePlayer = (name) => {
		setPlayers(players.filter(player => name !== player));
	}

	return (
		<div className="PlayerConfig page">
			<h2 className="page-title">Player Settings</h2>
			<form className="PlayerConfig-form" onSubmit={submitHandler}>
				<input className="PlayerConfig-form-input" type="text" value={newPlayerName} onChange={({ target }) => setNewPlayerName(target.value)} placeholder="Player Name" />
				<button className="PlayerConfig-form-button" type="submit">ADD</button>
			</form>
			<ul className="PlayerConfig-list">
				{players.map(name => (
					<li key={name} className="PlayerConfig-list-item">
						<div className="PlayerConfig-list-item-name">{name}</div>
						<button className="PlayerConfig-list-item-button emoji-button" onClick={() => removePlayer(name)}>❌</button>
					</li>
				))}
			</ul>
			<p className="PlayerConfig-total">Total: {pluralise(players.length, 'player')}</p>
			<button className="PlayerConfig-clear-button" onClick={() => setPlayers([])}>Reset all players</button>
		</div>
	);
};

export default PlayerConfig;