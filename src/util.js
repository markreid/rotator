export const minutesToSeconds = (minutes) => minutes * 60;
export const secondsToMinutes = (seconds) => seconds / 60;
export const twoDP = (num) => Math.round(num * 100) / 100;
export const niceMinutes = (seconds) => twoDP(secondsToMinutes(seconds));

// return a pluralised string
export const pluralise = (value, str, plural = null) =>
	value === 1 ? `${value} ${str}` : `${value} ${plural || `${str}s`}`;

// add a leading zero to single digits
export const leadingZero = (num) => (num < 10 && num > -10 ? `0${num}` : num);
// format seconds to clock

// format seconds in mm:ss
export const formatClock = (seconds) => {
	return `${seconds < 0 ? "-" : ""}${leadingZero(
		Math.floor(Math.abs(seconds) / 60),
	)}:${leadingZero(Math.floor(Math.abs(seconds) % 60))}`;
};

// calculate the sub times for a game
export const calcSubTimes = (gameSettings, subSettings, players) => {
	const { playersPerSub, subMultiplier } = subSettings;
	const { periodLengthMinutes, numPlayersOn } = gameSettings;
	const periodLengthSeconds = minutesToSeconds(periodLengthMinutes);
	const numChanges = calcChanges(
		numPlayersOn,
		players.length,
		playersPerSub,
		subMultiplier,
	);
	const subEvery = Math.ceil(periodLengthSeconds / (numChanges + 1));

	return new Array(numChanges).fill().map((x, i) => {
		const changeNumber = i + 1;
		const time = changeNumber * subEvery;
		return time;
	});
};

export const removeElement = (arr, index) =>
	arr.slice(0, index).concat(arr.slice(index + 1));

// return the minimum number of changes required for the
// entire team to rotate.
// -1 because the starting lineup isn't considered a change
export const calcMinChanges = (numPlayersOn, numPlayers, playersPerSub) => {
	// if there's no bench, no changes
	if (numPlayersOn >= numPlayers) return 0;

	// if number of players divides evenly into playersPerSub, it's that
	if (Number.isInteger(numPlayers / playersPerSub)) {
		return numPlayers / playersPerSub - 1;
	}

	return numPlayers - 1;
};

export const calcChanges = (
	numPlayersOn,
	numPlayers,
	playersPerSub,
	subMultiplier,
) => calcMinChanges(numPlayersOn, numPlayers, playersPerSub) * subMultiplier;

// number of seconds since a date
export const secondsSince = (date) =>
	Math.round((Date.now() - new Date(date)) / 1000);

// calculate how many seconds are on the clock
export const calcClockSeconds = (clock) => {
	if (!clock) return 0;
	const secondsAgo = clock.clockStartedAt
		? secondsSince(clock.clockStartedAt)
		: 0;
	return secondsAgo + clock.secondsAtStart;
};

// fisher yates shuffle
// https://javascript.info/task/shuffle
export const shuffle = (source) => {
	const arr = source.slice();
	for (let i = arr.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
};

export const calcPlayerTimesFromSubs = (players, subs, clockTime) => {
	// first map the player names
	const map = players.reduce(
		(acc, player) => ({
			...acc,
			[player]: {
				on: 0,
				off: 0,
				lastOn: 0,
				lastOff: 0,
			},
		}),
		{},
	);

	const windows = subs.map((sub, i) => ({
		...sub,
		length: (subs[i + 1]?.clockTime || clockTime) - sub.clockTime,
	}));

	windows.forEach((window) => {
		window.on.forEach((playerName, i) => {
			const player = map[playerName];
			player.on = player.on + window.length;
			const wasSubbed = i >= window.on.length - window.numChanges;
			player.lastOn = wasSubbed ? window.clockTime : player.lastOn;
		});
		window.off.forEach((playerName, i) => {
			const player = map[playerName];
			player.off = player.off + window.length;
			const wasSubbed = i >= window.off.length - window.numChanges;
			player.lastOff = wasSubbed ? window.clockTime : player.lastOff;
		});
	});

	return map;
};

// calculate the "subs plan". 
// how many changes will we make, how often do they happen, how much time 
// do players spend on the field vs bench per sub and in total.
export const calculateSubsPlan = (numPlayers, gameConfig, subsConfig) => {
	const { numPlayersOn, periodLengthMinutes } = gameConfig;
	const { playersPerSub, subMultiplier } = subsConfig;

	const numPlayersOff = numPlayers - numPlayersOn;
	const periodLengthSeconds = minutesToSeconds(periodLengthMinutes);

	const playerSecondsEach = (periodLengthSeconds * numPlayersOn) / numPlayers;
	const benchSecondsEach = (periodLengthSeconds * numPlayersOff) / numPlayers;

	const numChanges = calcChanges(
		numPlayersOn,
		numPlayers,
		playersPerSub,
		subMultiplier,
	);
	const subEvery = periodLengthSeconds / (numChanges + 1);

	// how long a player spends on/off in total
	const changesOnBench = Math.ceil(numPlayersOff / playersPerSub);
	const timeOnBench = changesOnBench * subEvery;
	const changesOnField = Math.ceil(numPlayersOn / playersPerSub);
	const timeOnField = changesOnField * subEvery;

	return {
		numPlayers,
		numPlayersOn,
		numPlayersOff,
		numChanges,
		subEvery,
		timeOnField,
		timeOnBench,
		playerSecondsEach,
		benchSecondsEach,
	};
};
