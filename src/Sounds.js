import "./Sounds.css";

import { SOUNDS, playSound } from "./sound";

const Sounds = () => {
	return (
		<div className="Sounds">
			<ul className="Sounds-list">
				{Object.keys(SOUNDS).map((sound) => (
					<li key={sound} className="Sounds-list-item">
						<button
							className="Sounds-list-item-button"
							onClick={() => playSound(sound)}
						>
							{sound}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Sounds;
