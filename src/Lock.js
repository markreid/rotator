import { useState } from "react";

import "./Lock.css";

const Lock = () => {
	const [locked, setLocked] = useState(false);
	return (
		<div className={`Lock ${locked ? "locked" : ""}`}>
			<button className="Lock-button" onClick={() => setLocked(!locked)}>
				{locked ? "🔒" : "🔓"}
			</button>
		</div>
	);
};

export default Lock;
