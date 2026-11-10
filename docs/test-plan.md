# Test-driven verification plan

Status: Slice 1 tests written and run (2026-11-09); later slices draft. Documentation review is not a feature test pass.

Follow the red → green → refactor cycle in [workflow](../workflow.md). Record actual commands, environments and outcomes in a validation log when executable work begins. Select the test runner after the stack decision.

| Test group | Requirements | Meaningful cases and expected evidence |
| --- | --- | --- |
| T-01 URL/rule unit tests | REQ-01–03 | Domain boundaries, subdomains, case, ports, IDN/punycode, path/query semantics, invalid schemes, duplicate rules, overlapping allow/block rules; exact examples approved in specs |
| T-02 Rule adapter integration | REQ-01–03/07 | Rule replacement succeeds atomically or preserves old set; rejected rules/quotas produce errors; actual top-level navigation blocked/allowed in both browsers; redirects cannot loop |
| T-03 Time/state tests | REQ-04/05 | Fake clock covers overnight schedules, DST skipped/repeated times, time-zone change, delayed alarm, sleep and worker/browser restart; persisted state determines correct next transition |
| T-04 Usage accounting | REQ-06/10 | Synthetic focused/idle/tab/window events, popup closure, repeated events, midnight, restart, simultaneous browsers, offline batch retries and out-of-order bucket versions |
| T-05 Auth security | REQ-08 | Google success/cancel/error, wrong state/nonce/redirect, reused code, invalid/expired/revoked token, refresh races, account switch and sign-out; live Google flow in both Chrome and Edge |
| T-06 Authorization integration | REQ-08–11 | Unauthenticated denied; user A cannot access user B profile/rules/usage/export even by changing IDs; reject unknown fields, huge payloads, unauthorized devices; real policies tested in local/provider test environment |
| T-07 Sync convergence | REQ-09/10 | Two clients converge; concurrent edits conflict visibly; delete vs edit resolved explicitly; tombstones, expired cursors, retries, duplicate operations, partial failures and account switching do not leak or resurrect data |
| T-08 Lifecycle/privacy | REQ-10–12 | Approved field filtering, private-mode behavior, retention boundary, export completeness, resumable account deletion, session revocation and stale-client upload rejection |
| T-09 UI acceptance | REQ-01–13 | Keyboard and screen-reader labels; empty/loading/offline/conflict/error states; invalid entry feedback; fake user values render as text; no token exposure to untrusted contexts |
| T-10 Operational/cost | REQ-14 | Synthetic expected workload measures reads/writes/egress, batch size, latency and storage; backend outage/429/quota recovery; migrations and restore rehearsal |
| T-11 Release regression | All approved | Packaged extension install/update/uninstall; fresh/existing config; normal/private windows as authorized; Chrome and Edge versions recorded separately |

## Proposed implementation order for each slice

1. Add a test named with its requirement ID; run and observe the expected behavior failure.
2. Add minimal implementation and observe green.
3. Refactor, run relevant regression checks and build.
4. Verify browser-specific behavior in a disposable test profile containing synthetic data.
5. Link the requirement, tests, commit/PR and recorded result. Unknown or blocked verification stays visibly incomplete.

Unit tests cannot prove DNR navigation, OAuth redirects, real provider authorization, Google consent behavior or branded-browser compatibility. Provider emulators support fast tests but must be complemented by isolated staging checks before release. Do not use the user's personal browsing data for load tests.

## Browser acceptance matrix

| Environment | Install/basic block | Schedule/restart | Auth/sync | Usage/privacy | Current state |
| --- | --- | --- | --- | --- | --- |
| Google Chrome 156.0.8078.80 | Pass (Slice 1, automated) | Restart: manual pending | Not run | Not run | See [validation](./validation.md) |
| Microsoft Edge 157.0.4341.42 | Pass (Slice 1, automated) | Restart: manual pending | Not run | Not run | See [validation](./validation.md) |

All required cells must pass before release, or the affected feature must be explicitly removed from release scope and documented.
