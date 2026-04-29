import "./PlayerList.css";

import ProgressBar from './ProgressBar';

import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListDivider from '@mui/joy/ListDivider';
import { IoArrowForward, IoArrowBack } from 'react-icons/io5';



const PlayerList = ({ players, variant, className, selected, select, timeOn, targetTimeOn, clockTime}) => {

	
	const timeOnReference = variant === 'on' ? 'lastOn' : 'lastOff';

	return (
		<div className={`PlayerList ${variant}`}>

			<List>
				<ListItem sx={{ fontWeight: 'bold', textTransform: 'capitalize', color: 'var(--c4)' }}>{className}</ListItem>
				<ListDivider />
				{players.map((player) => {
					const isSelected = selected.includes(player);
					const percentage = Math.round(((clockTime - timeOn[player][timeOnReference]) / targetTimeOn) * 100);
					return (
					<ListItem key={player} sx={{ paddingRight: '1px' }}>
						<ListItemButton
							selected={isSelected}
							onClick={() => select(player)}
							sx={{
								"&&:hover": { backgroundColor: isSelected ? (variant === "on" ? "var(--offlight)" : "var(--onlight)") : "transparent" },
								...(isSelected ? {
									"&&": {
										backgroundColor: variant === "on" ? "var(--offlight)" : "var(--onlight)",
									},
								} : {}),
							}}
						>
						<span style={{ flex: 1 }}>{player}</span>
						{percentage > 100 && (variant === 'on' ? <IoArrowForward color="var(--off)" /> : <IoArrowBack color="var(--on)" />)}
						</ListItemButton>						
						
						{/*<LinearProgress determinate value={percentage} />*/}
						
						<ProgressBar
								variant={`${variant} slim`}
								val={clockTime - timeOn[player][timeOnReference]}
								target={targetTimeOn}
							/>
					</ListItem>
					);
				})}
			</List>			
		</div>
	);
};

export default PlayerList;
