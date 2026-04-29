import { useState } from "react";


import { IoLockOpenOutline } from "react-icons/io5";
import { IoLockClosedOutline } from "react-icons/io5";



import "./Lock.css";

const Lock = () => {
	const [locked, setLocked] = useState(false);
	return (
		<div className={`Lock ${locked ? "locked" : ""}`}>
			<button className="Lock-button" onClick={() => setLocked(!locked)}>
				{locked ? <IoLockClosedOutline /> : <IoLockOpenOutline />}
			</button>
		</div>
	);
};

export default Lock;
