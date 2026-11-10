# Take Reins — product features

Last updated: **2026-11-09**

What the product does and is meant to do, by area: **shipped vs planned**. One line per feature with its ids. Details live in the linked spec, not here. Reasoning and requirement text: [`docs/requirements.md`](../docs/requirements.md); decisions: [`docs/decisions.md`](../docs/decisions.md); identity: [`PRODUCT.md`](../PRODUCT.md).

Status values: **Shipped** (implemented and verified) · **Shipped – partly verified** · **Approved** (spec approved, not built) · **Proposed** (needs spec/approval) · **Deferred** · **Excluded**

Scope: Chrome and Edge extension, Manifest V3. Mobile apps are out of scope (DEC-02).

---

## Blocking

| Feature | Ids | Status | Spec / notes |
|---|---|---|---|
| Add / list / remove blocked sites; input normalized (scheme, path, port, `www.` dropped; IDN → punycode); 500-site limit | SB-01, REQ-01 | Shipped – partly verified | [simple-blocker](../docs/specs/simple-blocker.md) |
| Site and all subdomains blocked for top-level http(s) navigations → Take Reins blocked page | SB-02, REQ-01 | Shipped – partly verified | One DNR redirect rule |
| Open tabs of a site switch to the blocked page when it is added or re-blocked | SB-06 | Shipped – partly verified | |
| Master on/off switch | BASIC-03 | Proposed | Excluded from Slice 1 |
| Keyword and path rules | REQ-02 | Proposed | |
| Category blocking | REQ-02 | Proposed | Needs licensed dataset (OPEN-12) |
| Allowlist-only mode | REQ-03 | Proposed | |

## Timed unblock

| Feature | Ids | Status | Spec / notes |
|---|---|---|---|
| Unblock **one site** for 5 / 10 / 15 min from the blocked page or popup; original URL reopens | SB-03, DEC-09 | Shipped – partly verified | |
| Badge shows minutes left; **last 2 minutes**: stopwatch icon and `m:ss` countdown | SB-04, DEC-10 | Shipped – partly verified | Icon look not yet seen by a human |
| **+1 / +2 min** in the popup and in a countdown notification | SB-05, DEC-11 | Shipped – partly verified | Notification buttons unverified |
| Timers survive worker restart, browser restart and sleep (absolute timestamps + alarms) | SB-07 | Shipped – partly verified | Restart and sleep: manual check pending |

## Schedules and focus

| Feature | Ids | Status | Spec / notes |
|---|---|---|---|
| Scheduled blocking (days, windows, overnight, DST) | REQ-04 | Proposed | |
| Focus / break sessions | REQ-05 | Proposed | |
| Daily time limits and insights | REQ-06 | Proposed | |

## Friction and blocked page

| Feature | Ids | Status | Spec / notes |
|---|---|---|---|
| Original blocked page with the site name as text | SB-02 | Shipped – partly verified | |
| Password / challenge before unblocking or changing settings | REQ-07 | Proposed | OPEN-12 |
| Custom blocked-page text/image; redirect to another site | REQ-07 | Proposed | |
| Preventing uninstall or disable | — | **Excluded** | Not possible; never claim it (AGENTS.md) |

## Accounts and cloud

| Feature | Ids | Status | Spec / notes |
|---|---|---|---|
| Google sign-in | REQ-08, DEC-03 | Approved requirement, flow pending | Deferred until after core slices (DEC-08) |
| Sync of profile and settings | REQ-09, DEC-04 | Approved requirement, scope pending | OPEN-06, OPEN-09 |
| Sync of usage statistics | REQ-10, DEC-04 | Approved requirement, scope pending | OPEN-07, OPEN-08 |
| Data export and deletion | REQ-11 | Proposed | Required before any cloud release |

## Platform and quality

| Feature | Ids | Status | Spec / notes |
|---|---|---|---|
| Same unpacked build in Chrome and Edge | SB-08 | Shipped – partly verified | Chrome 156, Edge 157 |
| Incognito / InPrivate (user enables it) | REQ-12 | Shipped – unverified | Documented in README |
| Keyboard access and labels | REQ-12 | Partly | Popup buttons have aria labels; no audit yet |
| Localization, rewards, uninstall alerts | REQ-13 | Proposed | Optional extras |
