import {
	reconcileLineup,
	calcEffectivePool,
	calculateSubsPlan,
	countSubEvents,
	calcForwardSchedule,
} from "./util";

describe("reconcileLineup", () => {
	it("keeps existing players in their current slot order", () => {
		const lineup = ["A", "B", "C", "D"];
		const activeRoster = ["A", "B", "C", "D"];
		expect(reconcileLineup(lineup, activeRoster)).toEqual([
			"A",
			"B",
			"C",
			"D",
		]);
	});

	it("appends a newly-active (late) player onto the bench", () => {
		// D was inactive at kickoff and has just been activated
		const lineup = ["A", "B", "C"];
		const activeRoster = ["A", "B", "C", "D"];
		expect(reconcileLineup(lineup, activeRoster)).toEqual([
			"A",
			"B",
			"C",
			"D",
		]);
	});

	it("drops a player who has been made inactive", () => {
		// C was pulled out of the game
		const lineup = ["A", "B", "C", "D"];
		const activeRoster = ["A", "B", "D"];
		expect(reconcileLineup(lineup, activeRoster)).toEqual(["A", "B", "D"]);
	});

	it("preserves field/bench order while dropping and adding at once", () => {
		const lineup = ["A", "B", "C", "D"];
		const activeRoster = ["A", "C", "D", "E"];
		expect(reconcileLineup(lineup, activeRoster)).toEqual([
			"A",
			"C",
			"D",
			"E",
		]);
	});

	it("returns the active roster when there is no saved lineup", () => {
		expect(reconcileLineup([], ["A", "B", "C"])).toEqual(["A", "B", "C"]);
	});
});

describe("calcEffectivePool", () => {
	const lineup = ["A", "B", "C", "D", "E", "F", "G", "H"]; // 8, 7 on field

	it("excludes a fixed field player (keeper) from the rotating pool", () => {
		expect(calcEffectivePool(lineup, ["A"], 7)).toEqual({
			fixedOnField: 1,
			fixedOnBench: 0,
			effectiveNumPlayersOn: 6,
			effectiveNumPlayers: 7,
		});
	});

	it("excludes a fixed bench player (injury) from the rotating pool", () => {
		// H is the only player on the bench (slice(7))
		expect(calcEffectivePool(lineup, ["H"], 7)).toEqual({
			fixedOnField: 0,
			fixedOnBench: 1,
			effectiveNumPlayersOn: 7,
			effectiveNumPlayers: 7,
		});
	});

	it("handles a fixed player on each side at once", () => {
		expect(calcEffectivePool(lineup, ["A", "H"], 7)).toEqual({
			fixedOnField: 1,
			fixedOnBench: 1,
			effectiveNumPlayersOn: 6,
			effectiveNumPlayers: 6,
		});
	});
});

describe("calculateSubsPlan with fixed players", () => {
	const gameConfig = { numPlayersOn: 7, periodLengthMinutes: 20 };
	const subsConfig = { playersPerSub: 1, benchTurns: 1 };

	it("plans against the effective pool when a keeper is fixed", () => {
		// 8 players, keeper fixed on field -> 7 rotate through 6 field slots
		const plan = calculateSubsPlan(8, gameConfig, subsConfig, {
			onField: 1,
			onBench: 0,
		});
		expect(plan.effectiveNumPlayers).toBe(7);
		expect(plan.effectiveNumPlayersOn).toBe(6);
		expect(plan.numChanges).toBe(6);
		expect(plan.subEvery).toBeCloseTo(1200 / 7, 5);
		expect(plan.benchSecondsEach).toBeCloseTo((1200 * 1) / 7, 5);
	});

	it("returns no changes when field and pool are equal (no bench)", () => {
		const plan = calculateSubsPlan(7, gameConfig, subsConfig);
		expect(plan.numChanges).toBe(0);
		expect(plan.subEvery).toBe(1200);
	});

	it("degrades safely (no NaN) when every rotating slot is fixed", () => {
		const plan = calculateSubsPlan(
			6,
			{ numPlayersOn: 6, periodLengthMinutes: 20 },
			subsConfig,
			{ onField: 6, onBench: 0 },
		);
		expect(plan.numChanges).toBe(0);
		expect(Number.isNaN(plan.playerSecondsEach)).toBe(false);
	});
});

describe("countSubEvents", () => {
	it("counts only entries with an actual change (skips the lineup entry)", () => {
		const subs = [
			{ numChanges: 0 },
			{ numChanges: 1 },
			{ numChanges: 1 },
			{ numChanges: 2 },
		];
		expect(countSubEvents(subs)).toBe(3);
	});
});

describe("calcForwardSchedule", () => {
	// 20-min period, 1 per sub. Natural interval = 1200 / rotating pool.
	const base = {
		periodLengthSeconds: 1200,
		floorFraction: 0.7,
	};

	it("reduces to the even whole-period grid at kickoff", () => {
		// pool of 8: 7 changes, natural 150s, nothing made yet
		expect(
			calcForwardSchedule({
				...base,
				clockTime: 0,
				numChanges: 7,
				naturalSubEvery: 150,
				eventsMade: 0,
			}),
		).toEqual([150, 300, 450, 600, 750, 900, 1050]);
	});

	it("scenario 1: 0 subs then +1 at 10:00 -> floor clamps to 4 subs", () => {
		expect(
			calcForwardSchedule({
				...base,
				clockTime: 600,
				numChanges: 6,
				naturalSubEvery: 1200 / 7,
				eventsMade: 0,
			}),
		).toEqual([720, 840, 960, 1080]);
	});

	it("scenario 2: +2 at 10:00 with 3 made -> slight squeeze, 5 subs", () => {
		expect(
			calcForwardSchedule({
				...base,
				clockTime: 600,
				numChanges: 8,
				naturalSubEvery: 1200 / 9,
				eventsMade: 3,
			}),
		).toEqual([700, 800, 900, 1000, 1100]);
	});

	it("scenario 3: 0 subs then +1 at 15:00 -> hard clamp, 2 subs", () => {
		expect(
			calcForwardSchedule({
				...base,
				clockTime: 900,
				numChanges: 6,
				naturalSubEvery: 1200 / 7,
				eventsMade: 0,
			}),
		).toEqual([1020, 1140]);
	});

	it("scenario 4: injury with 4 made -> intervals stretch, 2 subs", () => {
		expect(
			calcForwardSchedule({
				...base,
				clockTime: 600,
				numChanges: 6,
				naturalSubEvery: 1200 / 7,
				eventsMade: 4,
			}),
		).toEqual([800, 1000]);
	});

	it("returns nothing when no changes remain", () => {
		expect(
			calcForwardSchedule({
				...base,
				clockTime: 600,
				numChanges: 4,
				naturalSubEvery: 150,
				eventsMade: 4,
			}),
		).toEqual([]);
	});
});
