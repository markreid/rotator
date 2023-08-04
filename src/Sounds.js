import { SOUNDS, playSound } from "./sound";

const Sounds = () => {
	return <div className="Sounds">
		<ul>
			{Object.keys(SOUNDS).map((sound) => (
				<li>
				<button onClick={() => playSound(sound)}>{sound}</button>
				</li>
			))}
		</ul>

	</div>;
};

export default Sounds;
