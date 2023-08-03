import { useState } from "react";


import { resetAll } from './configs';

const reset = () => {
	resetAll();
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
