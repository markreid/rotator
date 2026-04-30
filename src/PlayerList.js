import "./PlayerList.css";

import ProgressBar from './ProgressBar';

import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListDivider from '@mui/joy/ListDivider';
import { IoArrowForward, IoArrowBack, IoArrowForwardCircle, IoArrowBackCircle, IoHandRightOutline } from 'react-icons/io5';

import { getDevMode } from './AppConfig';



const PlayerList = ({ players, variant, className, selected, select, timeOn, targetTimeOn, targetTotalTime, inverseTotalTime, clockTime}) => {
	const devMode = getDevMode();

	
	const timeOnReference = variant === 'on' ? 'lastOn' : 'lastOff';

	return (
		<div className={`PlayerList ${variant}`}>

			<List>
				<ListItem sx={{ fontWeight: 'bold', textTransform: 'capitalize', color: 'var(--c4)' }}>{className}</ListItem>
				<ListDivider />
				{players.map((player) => {
					const isSelected = selected.includes(player);
					
					// calc % of time in this state for the current sub only
					const percentageThisSub = Math.round(((clockTime - timeOn[player][timeOnReference]) / targetTimeOn) * 100);
					const totalTimeKey = variant === 'on' ? 'on' : 'off';
					
					// calc % of time in this state for the total game 
					const percentageTotal = Math.round((timeOn[player][totalTimeKey] / targetTotalTime) * 100);
					
					// calc % of time in the inverse state for the total game
					const inverseTimeKey = variant === 'on' ? 'off' : 'on';
					const percentageInverse = Math.round((timeOn[player][inverseTimeKey] / inverseTotalTime) * 100);

					// should this player stay where they are? ie, have they already done 100% of the time in the inverse state?
					const shouldStay = percentageInverse >= 100;					
					
					return (
					<ListItem key={player} sx={{ paddingRight: '1px', paddingBlock: '4px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
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
						<span style={{ flex: 1 }}>{player}{devMode && <span style={{ color: '#aaa', marginLeft: '4px', fontSize: '0.8em' }}>{percentageThisSub}% - {percentageTotal}%</span>}</span>
						{shouldStay ? <IoHandRightOutline color="var(--c4)" size="1.2em" /> : percentageTotal > 100 ? (variant === 'on' ? <IoArrowForwardCircle color="var(--off)" size="1.2em" /> : <IoArrowBackCircle color="var(--on)" size="1.2em" />) : percentageThisSub > 100 ? (variant === 'on' ? <IoArrowForward color="var(--off)" size="1.2em" /> : <IoArrowBack color="var(--on)" size="1.2em" />) : null}
						</ListItemButton>						
						
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
