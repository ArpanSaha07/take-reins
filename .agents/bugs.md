# Take Reins — bug log

Last updated: **2026-11-09** · Branch: `main`

Open bugs first, fixed bugs below them; a fixed entry keeps its reasoning. **Grep, don't read the whole file.** Bug ids are never reused.

**Highest id issued: BUG-001.** Take the next number for a new bug.

Entry format:

```
### BUG-NNN
**One-line symptom** · Severity (Blocker/High/Medium/Low) · OPEN | FIXED YYYY-MM-DD

**Found:** date, how, browser/version.
**Symptom.** What the user sees.
**Cause.** Root cause with file:line.
**Fix.** What changed and why; alternatives rejected.
**Verified:** the actual commands/results. Say what was *not* verified.
```

A bug that teaches a trap also gets a line in [`STATUS.md`](STATUS.md) *Watch out*.

---

## Open

| ID | Severity | Summary |
|---|---|---|
| — | — | No open bugs. |

---

## Fixed

| ID | Severity | Fixed | Summary |
|---|---|---|---|
| [BUG-001](#bug-001) | Medium | 2026-11-09 | Popup rebuilt its buttons every second, so a click could be swallowed |

### BUG-001
**A click in the popup could be lost while an unblock was running** · Medium · FIXED 2026-11-09

**Found:** 2026-11-09, by the browser acceptance run (AC6): clicking **+2 min** in the popup timed out in Chrome 156.

**Symptom.** While a site was unblocked, a popup button press could do nothing.

**Cause.** `render()` in `extension/popup.js` replaced every list item each second to update the clocks. A button swapped out between mouse-down and mouse-up never receives the click.

**Fix.** `render()` computes a structure key (sites, active unblocks, end times, urgent flags) and rebuilds the lists only when it changes; otherwise it updates the `.clock` text in place (`data-site`).

**Verified:** `node tests/e2e/browser.e2e.mjs chrome` 12/12 (twice) and `edge` 12/12 — AC6 passes. Not verified by a human click.
