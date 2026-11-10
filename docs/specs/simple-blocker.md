# Spec: Simple blocker with timed unblock (Slice 1)

Status: Approved 2026-11-09 (DEC-08–11) — Implemented; automated acceptance passed in Chrome 156 and Edge 157, manual restart/notification checks pending ([validation](../validation.md)). Requested by the product owner on 2026-11-09 as the first build ("simple extension for now"). It narrows [basic-release-plan](../basic-release-plan.md) BASIC-01–06 and adds a timed unblock. Google sign-in, sync, schedules, focus sessions and statistics stay deferred; no cloud, accounts or analytics in this slice.

## Requirements

| ID | Behavior |
| --- | --- |
| SB-01 | Add / list / remove blocked sites in the popup. Input is normalized: scheme, path, port and a leading `www.` are dropped, case lowered, IDN converted to punycode. Rejected: empty, no dot, invalid hostname, duplicates, more than 500 entries. Errors are shown as text; the stored list is unchanged on error. |
| SB-02 | A blocked site **and all its subdomains** are blocked for top-level HTTP(S) navigations (`youtube.com` blocks `m.youtube.com`, not `notyoutube.com`). The tab is redirected to a packaged Take Reins page that shows the site name as text. |
| SB-03 | Timed unblock of **one site** from the blocked page or the popup: 5, 10 or 15 minutes. The original URL opens after unblocking. Other sites stay blocked. |
| SB-04 | Final-two-minutes countdown: during the last 2 minutes of an unblock the toolbar icon turns into a stopwatch and the badge counts down `2:00 → 0:00` every second. Earlier, the badge shows remaining minutes (e.g. `4m`). With several unblocks, the soonest-ending one is shown. |
| SB-05 | Extend: `+1 min` and `+2 min` buttons in the popup for each active unblock, and on a desktop notification shown when the countdown starts. Extending above 2 min left hides the stopwatch again. |
| SB-06 | When an unblock ends, the site is blocked again and **already open tabs of that site are redirected** to the blocked page. Adding a site also redirects its open tabs. |
| SB-07 | Persistence and timing: sites and unblock end times are stored in `chrome.storage.local` as absolute timestamps. After service-worker restart, browser restart or sleep, any expired unblock is re-blocked immediately on wake/start. DST/time-zone changes do not affect durations. |
| SB-08 | Same unpacked build installs in Chrome and Edge. |

Exclusions: path/keyword rules, allowlist, schedules, passwords/challenges, master on/off switch, import/export, sync, statistics, incognito (works only if the user enables "Allow in incognito"). The extension cannot prevent being disabled or uninstalled.

## Acceptance criteria

1. Add `example.com` → visiting `https://example.com/a` and `https://sub.example.com` shows the blocked page; `https://notexample.com` loads.
2. Add `https://WWW.Example.com/path` → stored as `example.com`; adding it again shows "already blocked".
3. Remove `example.com` → it loads again.
4. Blocked page → "Unblock 5 min" → original URL loads; badge shows `5m`.
5. With ≤2 min left, icon is a stopwatch and badge counts `m:ss`; a notification offers +1/+2 min.
6. Press `+2 min` at ~0:30 left → ~2:30 left, stopwatch hides until 2:00 again.
7. At 0 the open tab of that site is redirected to the blocked page and new visits are blocked.
8. Restart the browser mid-unblock after its end time passes → site blocked on start.
9. Unit tests for normalization, rule building and timer state pass (`npm test`).

## Design

- MV3, plain JavaScript ES modules, no runtime dependencies, no build step. Tests: Node's built-in `node --test`.
- `src/core/` pure logic (domain normalization, state transitions, DNR rule building, badge text) — unit tested with a fake clock.
- `background.js` service worker: one dynamic DNR rule `requestDomains = blocked sites minus unblocked`, redirecting `main_frame` to `blocked.html#<original URL>`. Alarms at `end − 120 s` and `end`; a 1 s ticker runs only during the countdown.
- Popup and blocked page render values via `textContent`; CSP `script-src 'self'; object-src 'self'`. The blocked page only reopens http(s) URLs whose host matches an unblocked site.

## Permissions

| Permission | Why |
| --- | --- |
| `declarativeNetRequest` | Redirect navigations to blocked sites |
| `storage` | Save the site list and unblock timers locally |
| `alarms` | Wake the worker for countdown start and unblock end |
| `notifications` | Countdown "+1 / +2 min" prompt |
| Host access `http://*/*`, `https://*/*` | Required by Chrome for DNR *redirects* (not just blocking) and to find and redirect already-open tabs of a re-blocked site. The extension reads no page content. |
