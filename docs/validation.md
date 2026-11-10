# Validation log

## 2026-11-09 — Slice 1: simple blocker with timed unblock ([spec](./specs/simple-blocker.md))

Environment: Windows 10 Home 10.0.19045, Node.js 24.22.1, puppeteer-core 24.43.1 (CDP `Extensions.loadUnpacked`), headless, throwaway profile in `%TEMP%`, local HTTP server with `*.test → 127.0.0.1` host mapping. No personal profile or real sites used.

### Unit tests — `npm test`

Red observed first (modules missing: 4 files failed), then green: **20 tests, 20 pass, 0 fail.**

### Browser acceptance — `node tests/e2e/browser.e2e.mjs <chrome|edge>`

| Check | Spec AC | Chrome 156.0.8078.80 | Edge 157.0.4341.42 |
| --- | --- | --- | --- |
| Add normalizes `https://WWW.Blocked.test/some/path` → `blocked.test` | AC2 | Pass | Pass |
| Duplicate / invalid input rejected with message, list unchanged | AC2 | Pass | Pass |
| Blocked site → blocked page carrying original URL | AC1 | Pass | Pass |
| Subdomain blocked | AC1 | Pass | Pass |
| Near-miss `notblocked.test` allowed | AC1 | Pass | Pass |
| Hostile fragment (`javascript:`) offers no unblock/continue | Security | Pass | Pass |
| Unblock 5 min from blocked page reopens URL, badge `5m` | AC4 | Pass | Pass |
| ≤2 min: badge `m:ss` ticks each second, notification shown, popup highlights | AC5 | Pass | Pass |
| `+2 min` in popup → badge `4m`, notification cleared | AC6 | Pass | Pass |
| At zero: open tab redirected, badge cleared, new visit blocked | AC7 | Pass | Pass |
| Wake-up alarms exist at `end − 2 min` and `end` | AC8 (partial) | Pass | Pass |
| Remove site → loads again | AC3 | Pass | Pass |

Chrome was run twice end-to-end with 12/12 both times; Edge once with 12/12.

Issues found and fixed during the run:
- The popup rebuilt its buttons every second, which could swallow a click in progress. It now rebuilds only when its contents change and otherwise updates the clock text.

### Not yet verified (manual, pending)

| Check | Why not automated |
| --- | --- |
| AC8 full: browser restart after an unblock's end time → blocked on start | CDP-loaded extensions are not kept across a browser restart |
| Service worker terminated mid-countdown → alarm wakes it and re-blocks | `ServiceWorker.stopAllWorkers` left the worker unresponsive under puppeteer (alarm was confirmed scheduled ~3 s ahead) |
| Notification `+1 / +2 min` buttons | Notification buttons cannot be clicked through CDP |
| Visual check of the stopwatch icon in the toolbar | Headless; icon swap verified indirectly through badge/countdown state only |
| Sleep/wake | Requires a real sleep cycle |

Manual steps: load unpacked (README), block a test site, unblock 5 min, then (a) wait for the stopwatch and press **+1 min** in the notification; (b) unblock again, close the browser fully, wait past the end time, reopen — the site must be blocked.
