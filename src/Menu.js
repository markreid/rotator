import { useState } from "react";

import Box from '@mui/joy/Box';
import IconButton from '@mui/joy/IconButton';
import Button from '@mui/joy/Button';
import Drawer from '@mui/joy/Drawer';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListDivider from '@mui/joy/ListDivider';
import Stack from '@mui/joy/Stack';
import Sheet from '@mui/joy/Sheet';
import { IoMenuSharp } from "react-icons/io5";



import "./Menu.css";

import Lock from "./Lock";

const Menu = ({ screen, navigateTo, route, subRoute, setSubRoute, devMode }) => {
	const [visible, setVisible] = useState(false);

	const openLink = (destination, sub = null) => {
		navigateTo(destination);
		setSubRoute(sub);
		setVisible(false);
	};

	return (
		<Sheet variant="soft">
			<Stack
				direction="row"
				spacing={2}
				sx={{
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Box>
					<Lock />
				</Box>
				<Box>Rotator</Box>
				<Box>
					<IconButton 
						variant="plain"
						onClick={() => setVisible(!visible)}
					><IoMenuSharp /></IconButton>
				</Box>
			</Stack>

			<Drawer anchor="right" open={visible} onClose={() => setVisible(false)}>
				<List>
					<ListItem>
						<ListItemButton onClick={() => openLink('GAME')}>Game</ListItemButton>
					</ListItem>
					<ListItem>
						<ListItemButton onClick={() => openLink('GAME', 'stats')}>Stats</ListItemButton>
					</ListItem>
					<ListDivider />
					<ListItem>
						<ListItemButton onClick={() => openLink('PLAYERS')}>Players</ListItemButton>
					</ListItem>
					<ListItem>
						<ListItemButton onClick={() => openLink('GAME SETTINGS')}>Game setup</ListItemButton>
					</ListItem>
					<ListItem>
						<ListItemButton onClick={() => openLink('SUB SETTINGS')}>Sub Setup</ListItemButton>
					</ListItem>
					<ListDivider />
					<ListItem>
						<ListItemButton onClick={() => openLink('APPCONFIG')}>App Config</ListItemButton>
					</ListItem>
					{devMode && (
						<>
							<ListDivider />
							<ListItem>
								<ListItemButton onClick={() => openLink('SOUNDS')}>Test Sounds</ListItemButton>
							</ListItem>
							<ListItem>
								<ListItemButton onClick={() => openLink('PALETTE')}>Palette</ListItemButton>
							</ListItem>
						</>
					)}
				</List>
			</Drawer>

		</Sheet>
	);
};

export default Menu;
