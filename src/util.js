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
	const { playersPerSub, benchTurns } = subSettings;
	const { periodLengthMinutes, numPlayersOn } = gameSettings;
	const periodLengthSeconds = minutesToSeconds(periodLengthMinutes);
	const numChanges = calcChanges(
		numPlayersOn,
		players.length,
		playersPerSub,
		benchTurns,
	);
	const subEvery = Math.ceil(periodLengthSeconds / (numChanges + 1));

	return new Array(numChanges).fill().map((x, i) => {
		const changeNumber = i + 1;
		const time = changeNumber * subEvery;
		return time;
	});
};

export const calcRemainingSubTimes = (allSubTimes, subs, threshold) => {
	const remaining = [...allSubTimes];
	subs.forEach((sub) => {
		if (sub.numChanges === 0) return;
		const idx = remaining.findIndex(
			(t) => Math.abs(t - sub.clockTime) <= threshold,
		);
		if (idx !== -1) remaining.splice(idx, 1);
	});
	return remaining;
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
	benchTurns,
) => calcMinChanges(numPlayersOn, numPlayers, playersPerSub) * benchTurns;

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

// reconcile a saved lineup against the current active roster.
// players still active keep their field/bench slot (order preserved);
// players no longer active are dropped; newly-active players are appended
// to the end (i.e. onto the bench).
export const reconcileLineup = (lineup, activeRoster) => {
	const kept = lineup.filter((name) => activeRoster.includes(name));
	const added = activeRoster.filter((name) => !lineup.includes(name));
	return [...kept, ...added];
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
			if (!player) return;
			player.on = player.on + window.length;
			const wasSubbed = i >= window.on.length - window.numChanges;
			player.lastOn = wasSubbed ? window.clockTime : player.lastOn;
		});
		window.off.forEach((playerName, i) => {
			const player = map[playerName];
			if (!player) return;
			player.off = player.off + window.length;
			const wasSubbed = i >= window.off.length - window.numChanges;
			player.lastOff = wasSubbed ? window.clockTime : player.lastOff;
		});
	});

	return map;
};

// split the lineup at numPlayersOn and count how many fixed players sit on
// each side. fixed players hold a slot but leave the rotating pool, so the
// sub plan is computed against the "effective" (rotating) counts.
export const calcEffectivePool = (players, fixed, numPlayersOn) => {
	const fixedOnField = players
		.slice(0, numPlayersOn)
		.filter((p) => fixed.includes(p)).length;
	const fixedOnBench = players
		.slice(numPlayersOn)
		.filter((p) => fixed.includes(p)).length;
	return {
		fixedOnField,
		fixedOnBench,
		effectiveNumPlayersOn: numPlayersOn - fixedOnField,
		effectiveNumPlayers: players.length - fixedOnField - fixedOnBench,
	};
};

// calculate the "subs plan".
// how many changes will we make, how often do they happen, how much time
// do players spend on the field vs bench per sub and in total.
// fixedCounts removes fixed players from the rotating pool: everything is
// computed against the effective (rotating) player/field counts.
export const calculateSubsPlan = (
	numPlayers,
	gameConfig,
	subsConfig,
	fixedCounts = { onField: 0, onBench: 0 },
) => {
	const { numPlayersOn, periodLengthMinutes } = gameConfig;
	const { playersPerSub, benchTurns } = subsConfig;
	const periodLengthSeconds = minutesToSeconds(periodLengthMinutes);

	const effectiveNumPlayersOn = numPlayersOn - fixedCounts.onField;
	const effectiveNumPlayers =
		numPlayers - fixedCounts.onField - fixedCounts.onBench;
	const effectiveNumPlayersOff = effectiveNumPlayers - effectiveNumPlayersOn;

	// no rotating players (all fixed) or no rotating field slots: nobody
	// rotates, so return a degenerate plan with no changes and no divides by
	// zero. the returned times/targets are inert since nobody consumes them.
	if (effectiveNumPlayers <= 0 || effectiveNumPlayersOn <= 0) {
		return {
			numPlayers,
			numPlayersOn,
			numPlayersOff: numPlayers - numPlayersOn,
			effectiveNumPlayers: Math.max(0, effectiveNumPlayers),
			effectiveNumPlayersOn: Math.max(0, effectiveNumPlayersOn),
			numChanges: 0,
			subEvery: periodLengthSeconds,
			timeOnField: periodLengthSeconds,
			timeOnBench: 0,
			playerSecondsEach: periodLengthSeconds,
			playersPerSub,
			benchSecondsEach: 0,
		};
	}

	const playerSecondsEach =
		(periodLengthSeconds * effectiveNumPlayersOn) / effectiveNumPlayers;
	const benchSecondsEach =
		(periodLengthSeconds * effectiveNumPlayersOff) / effectiveNumPlayers;

	const numChanges = calcChanges(
		effectiveNumPlayersOn,
		effectiveNumPlayers,
		playersPerSub,
		benchTurns,
	);
	const subEvery = periodLengthSeconds / (numChanges + 1);

	// how long a player spends on/off in total
	const changesOnBench = Math.ceil(effectiveNumPlayersOff / playersPerSub);
	const timeOnBench = changesOnBench * subEvery;
	const changesOnField = Math.ceil(effectiveNumPlayersOn / playersPerSub);
	const timeOnField = changesOnField * subEvery;

	return {
		numPlayers,
		numPlayersOn,
		numPlayersOff: numPlayers - numPlayersOn,
		effectiveNumPlayers,
		effectiveNumPlayersOn,
		numChanges,
		subEvery,
		timeOnField,
		timeOnBench,
		playerSecondsEach,
		playersPerSub,
		benchSecondsEach,
	};
};

// count sub events actually made (the initial lineup entry has numChanges 0).
export const countSubEvents = (subs) =>
	subs.filter((sub) => sub.numChanges > 0).length;

// a stable string identifying the current pool/plan. the forward schedule is
// only re-planned when this changes, so navigating away and back (same pool)
// leaves the schedule untouched instead of re-anchoring the next bell.
export const scheduleSignature = (plan) =>
	[
		plan.effectiveNumPlayersOn,
		plan.effectiveNumPlayers,
		plan.numChanges,
		Math.round(plan.subEvery),
	].join(":");

// plan the remaining subs from the current moment to the end of the period.
// spread the changes still needed evenly over the time left, but never let
// the interval drop below floorFraction of the pool's natural interval. when
// the floor binds (or the whistle arrives first), the freshest players simply
// miss a spell rather than the whole team subbing frantically to catch up.
// evaluated at t=0 with no subs made, this reduces to the normal even plan.
export const calcForwardSchedule = ({
	clockTime,
	periodLengthSeconds,
	numChanges,
	naturalSubEvery,
	eventsMade,
	floorFraction,
}) => {
	const remainingChanges = Math.max(0, numChanges - eventsMade);
	const remainingTime = periodLengthSeconds - clockTime;
	if (remainingChanges === 0 || remainingTime <= 0) return [];

	const equalized = remainingTime / (remainingChanges + 1);
	const interval = Math.max(equalized, floorFraction * naturalSubEvery);

	const times = [];
	for (let k = 1; k <= remainingChanges; k++) {
		const time = Math.round(clockTime + k * interval);
		if (time >= periodLengthSeconds) break; // whistle: some players miss out
		times.push(time);
	}
	return times;
};

// calculate player spell counts
export const calculateSpellCounts = (subs, players) =>
	players.reduce((acc, player) => {
		let onSpells = 0;
		let offSpells = 0;
		subs.forEach((sub, i) => {
			const prev = subs[i - 1];
			if (i === 0) {
				if (sub.on.includes(player)) onSpells++;
				if (sub.off.includes(player)) offSpells++;
			} else {
				if (sub.on.includes(player) && !prev.on.includes(player))
					onSpells++;
				if (sub.off.includes(player) && !prev.off.includes(player))
					offSpells++;
			}
		});
		acc[player] = { on: onSpells, off: offSpells };
		return acc;
	}, {});

// a player should stay where they are if the time they have remaining
// in the inverse state is less than the "stay threshold", which is the
// length of a full spell * SHOULD_STAY_THRESHOLD.
export const calculateShouldStay = (
	inverseTotalTime,
	timeOnInverse,
	stayThreshold,
) => {
	const remainingInverse = inverseTotalTime - timeOnInverse;
	const shouldStay = inverseTotalTime > 0 && remainingInverse < stayThreshold;
	return shouldStay;
};
