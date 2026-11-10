# Project instructions

## Start every session here
Before any work, read [`.agents/STATUS.md`](.agents/STATUS.md) in full — it is the digest of where the project is (now / blocking bugs / traps / recently shipped). For the other tracking files, read the header (the lines above the first `---`) to know what they hold, then grep for what your task needs; do not read them whole.

| File | Holds | Use it to… |
| --- | --- | --- |
| [`.agents/STATUS.md`](.agents/STATUS.md) | Current state, ordered next steps, traps | Orient. Always read first |
| [`.agents/TODO.md`](.agents/TODO.md) | Full work queue by priority (P0–P3) | Pick up, add, or check whether work is already queued |
| [`.agents/product-features.md`](.agents/product-features.md) | Every feature with ids and shipped/planned status | Check what the product does or is meant to do |
| [`.agents/bugs.md`](.agents/bugs.md) | Open and fixed bugs with cause, fix, verification; highest id issued | Report or fix a defect; check for a known one |
| [`.agents/tasks-completed.md`](.agents/tasks-completed.md) | Finished items and a dated work log (append-only) | Check something was already done, and what was learned |
| [`.agents/SKILLS/`](.agents/SKILLS/) | Project skills, e.g. [`commit-msg`](.agents/SKILLS/commit-msg/SKILL.md) | Follow when the task matches the skill |

Specs, decisions, test results and architecture stay in `docs/` (`docs/specs/`, `docs/decisions.md`, `docs/validation.md`, `docs/architecture.md`). The `.agents/` files track work and link to them; do not duplicate their content.

## Before a unit of work ends
Update, in order: `.agents/STATUS.md` (code-as-of line, *Now*, *Watch out*, a *Recently shipped* row) · move finished `TODO.md` items to `tasks-completed.md` with a work-log entry · new or fixed bugs in `bugs.md` (next id; update *Highest id issued*) · feature status in `product-features.md` · decisions in `docs/decisions.md` · results in `docs/validation.md`. Update each file's *Last updated* date. Then offer a commit message (`commit-msg` skill); Arpan commits and pushes — do not `git commit` or `git push` unless asked in this session.

## Objective
Build an original, personal productivity browser extension for Google Chrome and Microsoft Edge, informed by observed BlockSite browser behavior. Mobile applications are outside scope.

## Workflow and approval
1. Inspect the workspace before modifying existing work.
2. Record reference observations with source, date, version when available, evidence, and limitations. Separate observations from proposed behavior.
3. Produce requirements, architecture, acceptance criteria, a test plan, and a phased backlog before feature implementation.
4. Obtain the user's approval of the concrete specification before implementing features. Record the approved scope and decisions.
5. Use test-driven development: write a meaningful failing test, implement the smallest change, then refactor and run relevant checks. Record actual results; never report an unexecuted check as passing.
6. Release only after the approved acceptance criteria are verified in both Chrome and Edge. Provide unpacked installation and rollback instructions.

## Engineering rules
- Use Manifest V3 and document each permission and its purpose.
- Keep blocking decisions deterministic and independently testable. Account for service-worker restarts, browser restart, sleep, local time, and daylight-saving changes.
- Store personal settings locally by default. Do not introduce accounts, analytics, remote code, or cloud services without an approved requirement.
- Validate all input, messages, imports, and stored data; render user values as text and use a restrictive content security policy.
- Use original code, branding, copy, and assets. Reference analysis informs behavior and does not authorize copying proprietary implementation or assets.
- Keep reference inspection scoped to BlockSite. Avoid collecting unrelated browsing history, credentials, or account data.
- Preserve the user's BlockSite configuration. Document and restore any temporary inspection changes.
- Do not claim an extension prevents disabling, uninstalling, or every browser-level bypass.
- Do not commit secrets, captured private profile data, dependency directories, or generated browser profiles.

## Documentation
Maintain traceability from requirement IDs to acceptance tests and implementation milestones. Keep decision records, known limitations, test results, and release instructions current.
