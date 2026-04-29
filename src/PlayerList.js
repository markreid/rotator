import "./PlayerList.css";

import ProgressBar from './ProgressBar';

import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListDivider from '@mui/joy/ListDivider';
import LinearProgress from '@mui/joy/LinearProgress';



const PlayerList = ({ players, variant, className, selected, select, timeOn, targetTimeOn, clockTime}) => {

	
	const timeOnReference = variant === 'on' ? 'lastOn' : 'lastOff';

	return (
		<div className={`PlayerList ${variant}`}>

			<List>
				<ListItem>{className}</ListItem>
				<ListDivider />
				{players.map((player) => {
					const isSelected = selected.includes(player);
					const percentage = Math.round(((clockTime - timeOn[player][timeOnReference]) / targetTimeOn) * 100);
					return (
					<ListItem key={player}>
						<ListItemButton selected={isSelected} onClick={() => select(player)}>
						{player}
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

			{/* }
			<ul className="PlayerList-list">
				{players.map((player) => {
					const isSelected = selected.includes(player);
					return (
						<li
							key={player}
							className={`PlayerList-list-item ${
								isSelected ? "selected" : ""
							}`}
						>
							<button
								className="PlayerList-list-item-button"
								onClick={() => select(player)}
							>
								{player}
							</button>
							<ProgressBar
								variant={`${variant} slim`}
								val={clockTime - timeOn[player][timeOnReference]}
								target={targetTimeOn}
							/>
						</li>
					);
				})}
			</ul>
			*/}
		</div>
	);
};

export default PlayerList;
