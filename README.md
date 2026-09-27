# Beforewrite

A synthetic, browser-only answer to DOO's **Simulate Before You Act** mission. Open `index.html` or the GitHub Pages URL. `npm test` runs the policy tests.

## Architecture

Intent: select invoice records for a bulk delete. Simulate: compute a before/after record count and value, traverse direct references, and retain a versioned snapshot. Present: show direct effects, linked records, and rollback path in one review pane. Execute: only after human approval, perform an actual localStorage deletion. Verify: compare observed record count to the predicted postcondition. If it differs, restore the snapshot. A version mismatch blocks execution and requires a fresh preview.

## 90-second walkthrough

1. Select R-104 and simulate. The linked support ticket R-107 blocks deletion.
2. Select R-106 instead. The predicted diff permits review; approve and see the record removed from localStorage.
3. Reset, select R-106, and use **Inject hidden side effect**. A separate paid invoice is unexpectedly removed; the postcondition fails and rollback restores all four records.

## Failure test

Simulation under-predicts a secondary deletion. The post-execution count catches it, restores the snapshot, and reports the mismatch. This is a local demo of a compensating safety net, not a transactional database guarantee.

## Two-year thesis

Simulation should be a required operation for agents that write to consequential systems. A useful preview contains a diff, affected people or records, assumptions, side effects, and a rollback plan; a generic confirmation prompt is insufficient. The simulation must bind to a version of source state so approval cannot silently authorize a changed action. After execution, the system should compare observed effects with predicted effects and stop or compensate on mismatch. In two years, this may be the normal interface between agents and transaction systems. The difficult part will be measuring uncertainty in side effects and deciding which actions need human review even when a simulator reports low risk.

Built with Codex assistance. Synthetic local records only. No real invoices, external APIs, payment, email, or production deletion. The rollback demonstration is within this browser's localStorage, not a promise of recovery in a real system.
