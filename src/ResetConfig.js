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
						navigator.serviceWorker
							.getRegistration()
							.then((reg) => {
								reg.waiting.postMessage({
									type: "SKIP_WAITING",
								});

								setWorkerWaiting(false);

								// not sure if we need to wait here because
								// the postMessage is _probably_ async?
								document.location.reload();
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
