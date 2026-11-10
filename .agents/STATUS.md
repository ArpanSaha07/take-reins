# Take Reins — status

**Code as of:** `7c97e32` · 2026-11-09 · branch `main`, in sync with `origin/main` (github.com/ArpanSaha07/take-reins). **Uncommitted on top:** the `.agents/` tracking files and the `AGENTS.md` section that points to them.

Where the project is right now. **Orient from this file, not from [`TODO.md`](TODO.md)** — that is the full queue, this is the digest. Update it at the end of every unit of work (see *Before a unit of work ends* in [`../AGENTS.md`](../AGENTS.md)).

## Now (in order)

1. **Finish verifying Slice 1 by hand in Chrome and Edge** — automated acceptance passed (12/12 in Chrome 156 and Edge 157), but browser restart, worker termination, the notification's +1/+2 buttons, the stopwatch icon's look and sleep/wake are unverified ([`docs/validation.md`](../docs/validation.md), P1 in [`TODO.md`](TODO.md)). Slice 1 is not *Verified* until these pass.
2. **Choose the next slice** — schedules, focus sessions, or Google sign-in/sync ([`docs/basic-release-plan.md`](../docs/basic-release-plan.md)). Each needs its own spec in `docs/specs/` approved before code.
3. **Answer the open decisions that block later slices** — OPEN-04 (personal vs public), OPEN-05 (hosting budget), OPEN-06/07 (profile and statistics fields) in [`docs/decisions.md`](../docs/decisions.md).

## Open bugs that block

None. Highest bug id issued: **BUG-001** ([`bugs.md`](bugs.md)).

## Watch out

- **Spec before code.** A feature needs an approved spec in `docs/specs/` and a decision row in `docs/decisions.md` before implementation (DEC-07). Ask with `AskUserQuestion`; never infer approval.
- **Branded Chrome 137+ ignores `--load-extension`.** Browser tests load the extension through CDP `Extensions.loadUnpacked` (puppeteer `installExtension`), which does **not** survive a browser restart — restart behavior can only be checked by hand ([`tests/e2e/browser.e2e.mjs`](../tests/e2e/browser.e2e.mjs)).
- **`ServiceWorker.stopAllWorkers` wedges the worker under puppeteer** — the worker target stays listed but never answers. It does not prove an alarm/wake bug; do not use it as a test.
- **Prefer clicking by text in the page (`$$eval` + `click()`) in E2E.** Puppeteer's handle `click()` and `::-p-text` locators hung on the live-updating popup.
- **The popup must not rebuild its DOM every second** — it swallowed clicks (BUG-001). Rebuild on structure change only; update `.clock` text otherwise (`extension/popup.js`).
- **DNR redirect needs host permissions** and `blocked.html` must stay in `web_accessible_resources`, or blocked navigations fail instead of redirecting.
- **PowerShell 5.1 `Set-Content` writes ANSI** and mangled an em dash in `package.json`; write files with the editor tools or `-Encoding utf8`.

## Recently shipped

| Date | What landed |
|---|---|
| 2026-11-09 | **Tracking files in `.agents/`** and the `AGENTS.md` session map — uncommitted. |
| 2026-11-09 | **Repository on GitHub** — `87d9126` (Slice 1) merged with the GitHub initial commit (LICENSE) in `7c97e32`, pushed to `origin/main`. |
| 2026-11-09 | **Slice 1: site blocker with per-site 5/10/15-min unblock, 2-minute stopwatch countdown, +1/+2 min** — `87d9126`. 20/20 unit tests; 12/12 browser checks in Chrome 156 and Edge 157 ([spec](../docs/specs/simple-blocker.md), [validation](../docs/validation.md)). |
| 2026-10-26 | Basic-features-first release plan proposed ([`docs/basic-release-plan.md`](../docs/basic-release-plan.md)). |
| 2026-10-25 | Product identity approved; discovery, requirements, architecture, test plan and backlog drafted. |

Older detail: [`tasks-completed.md`](tasks-completed.md).
