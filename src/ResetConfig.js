import { useState, useEffect } from "react";

import ResetButton from "./ResetButton";

const ResetConfig = () => {
	const [workerWaiting, setWorkerWaiting] = useState(false);

	useEffect(() => {
		navigator.serviceWorker
			.getRegistration()
			.then((registration) => {
				setWorkerWaiting(registration ? registration.waiting : null);
			})
			.catch((err) => {
				setWorkerWaiting(null);
			});
	}, []);

	return (
		<div className="page">
			<h2 className="page-title">Reset</h2>
			<p className="pad">Restart the app or reset all settings below.</p>
			<ResetButton />

			<div className="BigButtons">
				<button
					className="BigButtons-button alt"
					disabled={!workerWaiting}
					onClick={() => {
						workerWaiting.postMessage({ type: "SKIP_WAITING " });
						// is this the right event to wait for?
						navigator.serviceWorker.ready.then(() => {
							// document.location.reload();
						});
					}}
				>
					{workerWaiting === false && "Checking for updates"}
					{workerWaiting === null && "No updates found"}
					{!!workerWaiting && "Update now"}
				</button>
			</div>
		</div>
	);
};

export default ResetConfig;
