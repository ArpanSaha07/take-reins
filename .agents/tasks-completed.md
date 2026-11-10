# Take Reins — completed tasks

Last updated: **2026-11-09**

Finished work, moved out of [`TODO.md`](TODO.md) so the queue stays short. Nothing here needs doing; it is kept because *what was tried and why* is expensive to rediscover. **Append-only** — do not rewrite old entries to match later findings; add a new one.

Two halves:

- **[By topic](#by-topic)** — checklist items as they appeared in `TODO.md`. Answers *was this ever done?*
- **[Work log](#work-log)** — dated entries, newest first. Answers *what happened that day and what did we learn?*

Defects go in [`bugs.md`](bugs.md); decisions in [`docs/decisions.md`](../docs/decisions.md).

---

## By topic

### Extension / Features

- [x] **Slice 1: simple blocker with timed unblock** — done 2026-11-09 in `87d9126`. Spec [simple-blocker](../docs/specs/simple-blocker.md) (SB-01 … SB-08), DEC-08 … DEC-11.

### Verification

- [x] **Unit tests for the pure core** — done 2026-11-09: `tests/*.test.js`, 20 tests (domain, state, display, rules).
- [x] **Automated browser acceptance in Chrome and Edge** — done 2026-11-09: `tests/e2e/browser.e2e.mjs`, 12/12 in Chrome 156.0.8078.80 and Edge 157.0.4341.42.

### Infrastructure & tooling

- [x] **Git repository on GitHub** — done 2026-11-09: `origin` = github.com/ArpanSaha07/take-reins, `main` pushed (`7c97e32`).
- [x] **Agent tracking files** — done 2026-11-09: `.agents/` (STATUS, TODO, bugs, product-features, tasks-completed, SKILLS/commit-msg) and the `AGENTS.md` session map.

### Planning docs

- [x] **Product identity** — approved 2026-10-25 ([`PRODUCT.md`](../PRODUCT.md), DEC-01).
- [x] **Discovery, requirements, architecture, test plan, backlog** — drafted 2026-10-25 (`docs/`).
- [x] **Basic-features-first plan** — proposed 2026-10-26 ([`docs/basic-release-plan.md`](../docs/basic-release-plan.md)).

---

## Work log

**2026-11-09 — agent tracking files.**

- **The ask:** Arpan created empty files in `.agents/` and asked for them to be set up like his campus-vibe repo (`.claude/STATUS.md`, `TODO/`, `bugs/`), and for `AGENTS.md` to send future agents to them.
- **Adapted, not copied:** campus-vibe splits open and fixed bugs into two files and keeps docs/ADRs under `.claude/`; here the existing `docs/` stays the home of specs, decisions and validation, and `bugs.md` holds both open and fixed bugs, matching the files Arpan created.

**2026-11-09 — Slice 1 built: site blocker with timed unblock.**

- **The ask:** a simple extension that blocks stored sites, with a 5/10-minute unblock, a stopwatch on the icon as the end approaches, and +1/+2 minutes before it re-blocks.
- **Spec first** (DEC-07): `docs/specs/simple-blocker.md`. Arpan chose per-site unblocks, a 2-minute countdown window, and +1/+2 in both the popup and a notification; approved the rest (subdomains blocked, open tabs redirected, 5/10/15 options, plain JS + `node --test`, broad host access).
- **Design:** pure modules in `extension/core/` (domain normalization, state transitions with an injected clock, badge text, DNR rule building); `background.js` does only I/O. One DNR redirect rule with `requestDomains`, original URL carried in the blocked page's fragment. End times are absolute epoch ms, so DST and time-zone changes cannot shift them. Alarms at `end − 2 min` and `end`; a 1-second ticker only during the countdown.
- **TDD:** tests written first, red observed (modules missing), then green; 20/20.
- **Browser runs found BUG-001** (popup re-render swallowing clicks) — fixed.
- **Learned:** branded Chrome 137+ ignores `--load-extension`, so tests use CDP `Extensions.loadUnpacked`; that extension does not survive a restart, and `ServiceWorker.stopAllWorkers` wedges the worker, so restart and worker-kill checks stay manual.
- **Verified:** 12/12 browser checks in Chrome 156 and Edge 157. **Not verified:** browser restart, notification buttons, stopwatch icon visually, sleep/wake.
- Arpan committed and pushed it himself (`87d9126`, merged with GitHub's initial commit in `7c97e32`).

**2026-10-25 / 26 — planning.**

- Product identity approved (Take Reins). Cloud sign-in and sync approved as requirements; provider, budget and data scope left open (OPEN-04 … OPEN-12). BlockSite reference inventory recorded from public help pages and a partial UI look; package analysis pending a version choice (OPEN-01).
