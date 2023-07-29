export const minutesToSeconds = (minutes) => minutes * 60;
export const secondsToMinutes = (seconds) => (seconds / 60);
export const twoDP = (num) => Math.round(num * 100) / 100;
export const niceMinutes = (seconds) => twoDP(secondsToMinutes(seconds));


// return a pluralised string
export const pluralise = (value, str, plural = null) => 
	value === 1 ? `${value} ${str}` : `${value} ${(plural || `${str}s`)}`;

// calculate the minimum number of changes required 
// for the entire team to get a rotation.
export const calculateMinimumChanges = (numPlayers, subsPerChange) => {
	
	// if subsPerChange divides cleanly into numPlayers, use that.
	if (Number.isInteger(numPlayers/subsPerChange)) {
		return numPlayers/subsPerChange;
	} 

	// otherwise it's just the number of players
	return numPlayers;
}

// add a leading zero to single digits
export const leadingZero = (num) => (num < 10 && num > -10) ? `0${num}` : num;
// format seconds to clock


// format seconds in mm:ss 
export const formatClock = (seconds) => {	
	return `${seconds < 0 ? '-' : ''}${leadingZero(Math.floor(Math.abs(seconds)/60))}:${leadingZero(Math.floor(Math.abs(seconds)%60))}`;
};

// calculate our sub array
export const calcSubs = (players, numPlayersOn, subEvery, numChanges, subsPerChange) => {
	return new Array(numChanges - 1).fill().map((x, changeIndex) => {
    return new Array(Number(subsPerChange)).fill().map((y, subIndex) => {
      const index = (changeIndex * subsPerChange) + subIndex;      
      return ({
      	index,
        on: players[(index + numPlayersOn) % players.length],
        off: players[index % players.length], 
        time: Math.floor((changeIndex + 1) * subEvery),
        made: false,
      })
    });

  }).flat();
}

// return a sub array with made:true at the specified index
export const setSubAsMade = (subs, index) => {
	return subs.map((sub, i) => Object.assign({}, sub, {
		made: sub.index !== index ? sub.made : true,
	}));
}

// pull data from localStorage
export const getConfig = (key, fallback = null) => {
	return JSON.parse(localStorage.getItem(`rotator.${key}`)) || fallback;
}

// save data to localStorage
export const saveConfig = (key, value) => {
	return localStorage.setItem(`rotator.${key}`, JSON.stringify(value));
}