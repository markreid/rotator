import { useState } from "react";

const reset = () => {
	localStorage.removeItem("rotator.players");
	localStorage.removeItem("rotator.playerSettings");
	localStorage.removeItem("rotator.subSettings");
	localStorage.removeItem("rotator.gameSettings");
	document.location.reload();
};

const ResetButton = () => {
	const [hasReset, setHasReset] = useState(false);

	return (
		<div className="BigButtons">
			<button className="BigButtons-button"
				onClick={()=> document.location.reload()}
				>RESTART</button>
			<button
				disabled={hasReset}
				className="BigButtons-button dangerous"
				onClick={() => {
					reset();
					setHasReset(true);
				}}
			>
				RESET ALL SETTINGS
			</button>			
		</div>
	);
};

export default ResetButton;
