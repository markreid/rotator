import { useState } from "react";

import "./Menu.css";

const MenuItem = ({ link, navigate }) => (
	<li className="Menu-list-item">
		<button
			className="Menu-button"
			onClick={() => navigate(link.toUpperCase())}
		>
			{link}
		</button>
	</li>
);

const MenuDivider = ({ title }) => (
	<li className="Menu-list-item Menu-divider">{title}</li>
);

const Menu = ({ screen, setScreen }) => {
	const [visible, setVisible] = useState(false);

	const navigate = (destination) => {
		setScreen(destination);
		setVisible(false);
	};

	return (
		<div className={`Menu ${visible ? "visible" : ""}`}>
			<button
				className="Menu-burger"
				onClick={() => setVisible(!visible)}
			>
				⚙️
			</button>

			{visible && (
				<>
					<ul className="Menu-list">
						<MenuDivider title="Game" />
						<MenuItem link="Game" navigate={navigate} />

						<MenuDivider title="Settings" />
						<MenuItem link="Players" navigate={navigate} />
						<MenuItem link="Game Settings" navigate={navigate} />
						<MenuItem link="Sub Settings" navigate={navigate} />
					</ul>
				</>
			)}
		</div>
	);
};

export default Menu;
