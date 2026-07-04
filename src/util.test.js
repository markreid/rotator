import { reconcileLineup } from "./util";

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
