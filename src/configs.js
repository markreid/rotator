const CLOCK_DEFAULTS = {
	clockRunning: false,
	clockStartedAt: null,
	secondsAtStart: 0,
};

const SUBSCONFIG_DEFAULTS = {
	playersPerSub: 1,
	subMultiplier: 1,
};

const GAMECONFIG_DEFAULTS = {
	numPeriods: 2,
	periodLengthMinutes: 20,
	numPlayersOn: 4,
};

const SUBS_DEFAULT = [];
const PLAYERS_DEFAULT = [];

export const DEFAULTS = {
	subs: SUBS_DEFAULT,
	players: PLAYERS_DEFAULT,
	clock: CLOCK_DEFAULTS,
	subsConfig: SUBSCONFIG_DEFAULTS,
	gameConfig: GAMECONFIG_DEFAULTS,
};

// if you make a sub within this many seconds of a 
// suggested sub time, we clear that sub time from 
// the list.
export const SUB_TIME_THRESHOLD = 30;
export const NEXT_SUB_WARNING = 5;


export const getDefaults = (key) => {
	if (!DEFAULTS[key]) throw new Error(`Unknown config key: ${key}`);
	return Array.isArray(DEFAULTS[key]) ? [...DEFAULTS[key]] : { ...DEFAULTS[key]};
}

// pull data from localStorage
export const getConfig = (key) => JSON.parse(localStorage.getItem(`rotator.${key}`)) || getDefaults(key);

// save data to localStorage
export const saveConfig = (key, value) => 
	localStorage.setItem(`rotator.${key}`, JSON.stringify(value));

// reset to a default value
export const resetConfig = (key) => {
	const defaultValue = getDefaults(key);
	saveConfig(key, defaultValue);
	return defaultValue;
}

// clear everything
export const resetAll = () => 
	Object.keys(DEFAULTS).forEach((key) => 
		localStorage.removeItem(`rotator.${key}`)
	)

