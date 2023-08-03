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

const Menu = ({ screen, navigateTo }) => {
	const [visible, setVisible] = useState(false);

	const openLink = (destination) => {
		navigateTo(destination);
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
						<MenuItem link="Game" navigate={openLink} />

						<MenuDivider title="Settings" />
						<MenuItem link="Players" navigate={openLink} />
						<MenuItem link="Game Settings" navigate={openLink} />
						<MenuItem link="Sub Settings" navigate={openLink} />
						<MenuItem link="Reset" navigate={openLink} />
					</ul>
				</>
			)}
		</div>
	);
};

export default Menu;
