const CLOCK_DEFAULTS = {
	clockRunning: false,
	clockStartedAt: null,
	secondsAtStart: 0,
};

const SUBSCONFIG_DEFAULTS = {
	playersPerSub: 1,
	benchTurns: 1,
	nextSubWarning: 30,
};

const GAMECONFIG_DEFAULTS = {
	numPeriods: 2,
	periodLengthMinutes: 20,
	numPlayersOn: 7,
};

const SUBS_DEFAULT = [];
const PLAYERS_DEFAULT = [];
const INACTIVE_PLAYERS_DEFAULT = [];
const LINEUP_DEFAULT = [];
// players "fixed" in place (e.g. a goalkeeper, or an injured player parked
// on the bench). they hold their slot but are excluded from the rotating
// pool: no auto-subs, no sub-time calculations.
const FIXED_PLAYERS_DEFAULT = [];
// the forward sub schedule. persisted (rather than re-derived each mount)
// so navigating away and back doesn't re-anchor the next bell. `times` are
// absolute clock seconds; `signature` identifies the pool/plan they were
// computed for, so we only re-plan when the pool actually changes.
const SCHEDULE_DEFAULT = { times: [], signature: null };

export const DEFAULTS = {
	subs: SUBS_DEFAULT,
	players: PLAYERS_DEFAULT,
	inactivePlayers: INACTIVE_PLAYERS_DEFAULT,
	lineup: LINEUP_DEFAULT,
	fixedPlayers: FIXED_PLAYERS_DEFAULT,
	schedule: SCHEDULE_DEFAULT,
	clock: CLOCK_DEFAULTS,
	subsConfig: SUBSCONFIG_DEFAULTS,
	gameConfig: GAMECONFIG_DEFAULTS,
};

// if you make a sub within this many seconds of a suggested
// sub, we clear that sub from the list.
export const SUB_TIME_THRESHOLD = 30;

// A player "should stay" if their remaining time in the inverse state
// (e.g. bench time for a field player) is less than this fraction of a
// sub interval. At 1.0, they stay once there's less than one full sub
// interval remaining. Lower values (e.g. 0.5) would allow sending them
// back if there's at least half a sub interval of time left.
export const SHOULD_STAY_THRESHOLD = 0.75;

// When the rotating pool changes mid-period we re-plan the remaining subs by
// spreading them evenly over the time left. This is the floor on how short
// that interval may get, as a fraction of the pool's natural sub interval.
// Above it we allow a "slight squeeze" so everyone still rotates; below it we
// clamp and let the freshest players miss a spell rather than sub frantically.
// At ~0.7: a squeeze to 75% of natural is allowed, a scramble to 50% is not.
export const MIN_SPELL_FRACTION = 0.7;

export const getDefaults = (key) => {
	if (!DEFAULTS[key]) throw new Error(`Unknown config key: ${key}`);
	return Array.isArray(DEFAULTS[key])
		? [...DEFAULTS[key]]
		: { ...DEFAULTS[key] };
};

// pull data from localStorage
export const getConfig = (key) =>
	JSON.parse(localStorage.getItem(`rotator.${key}`)) || getDefaults(key);

// save data to localStorage
export const saveConfig = (key, value) =>
	localStorage.setItem(`rotator.${key}`, JSON.stringify(value));

// reset to a default value
export const resetConfig = (key) => {
	const defaultValue = getDefaults(key);
	saveConfig(key, defaultValue);
	return defaultValue;
};

// clear everything
export const resetAll = () =>
	Object.keys(DEFAULTS).forEach((key) =>
		localStorage.removeItem(`rotator.${key}`),
	);

export const getActivePlayers = () => {
	const players = getConfig("players");
	const inactive = getConfig("inactivePlayers");
	return players.filter((p) => !inactive.includes(p));
};
