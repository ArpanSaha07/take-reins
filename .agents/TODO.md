# Take Reins — TODO

Last updated: **2026-11-09** · Branch: `main`

**This is the full queue, not the orientation file.** Orient from [`STATUS.md`](STATUS.md); come here to pick up an item, add one, or grep whether something is already queued. Finished items move to [`tasks-completed.md`](tasks-completed.md) — check there before building something that may already exist. Features and their requirement ids: [`product-features.md`](product-features.md). Defects: [`bugs.md`](bugs.md).

Priorities: **P0** blocking / broken · **P1** next up · **P2** planned · **P3** backlog
Item format: `- [ ] **P?** Outcome — context, links (REQ/SB/BUG/DEC ids). Added YYYY-MM-DD.`

---

## P0 — Blocking

_None._

## Verification

- [ ] **P1** Manual: unblock a site, close the browser fully, wait past the end time, reopen — site is blocked on start (SB-07, AC8). Added 2026-11-09.
- [ ] **P1** Manual: during the countdown press **+1 min** and **+2 min** on the notification — time extends, notification clears (SB-05). Added 2026-11-09.
- [ ] **P1** Manual: the toolbar icon switches to the stopwatch at 2:00 and back after extending past 2:00 (SB-04). Added 2026-11-09.
- [ ] **P1** Manual: sleep the computer through an unblock's end — site re-blocked on wake (SB-07). Added 2026-11-09.
- [ ] **P2** Find a reliable automated way to terminate the service worker mid-countdown (CDP `stopAllWorkers` wedges it — see STATUS *Watch out*). Added 2026-11-09.
- [ ] **P2** Record the results in [`docs/validation.md`](../docs/validation.md) and mark the Slice 1 spec *Verified*. Added 2026-11-09.

## Product decisions (owner: Arpan)

- [ ] **P1** Pick the next slice: schedules, focus sessions, or Google sign-in/sync ([`basic-release-plan.md`](../docs/basic-release-plan.md)). Added 2026-11-09.
- [ ] **P2** Resolve OPEN-04 … OPEN-12 in [`docs/decisions.md`](../docs/decisions.md) — needed before cloud work (REQ-08–11). Added 2026-11-09.

## Extension / Features

- [ ] **P2** Scheduled blocking — days, time windows, overnight, DST (REQ-04). Needs a spec. Added 2026-11-09.
- [ ] **P2** Focus / break sessions surviving popup close and worker restart (REQ-05). Needs a spec. Added 2026-11-09.
- [ ] **P2** Google sign-in and profile/settings sync (REQ-08, REQ-09; DEC-03/04). Needs provider and budget decisions first. Added 2026-11-09.
- [ ] **P2** Usage measurement, daily limits and insights (REQ-06, REQ-10). Added 2026-11-09.
- [ ] **P3** Master on/off switch for blocking (BASIC-03, excluded from Slice 1). Added 2026-11-09.
- [ ] **P3** Keyword / path rules, allowlist mode (REQ-02, REQ-03). Added 2026-11-09.
- [ ] **P3** Import / export of the block list. Added 2026-11-09.
- [ ] **P3** Friction options: password or challenge before unblocking (REQ-07, OPEN-12). Added 2026-11-09.
- [ ] **P3** Custom blocked page text/image and redirect target (REQ-07). Added 2026-11-09.

## Infrastructure & tooling

- [ ] **P2** GitHub Actions: run `npm test` on push and pull request. Added 2026-11-09.
- [ ] **P2** Release packaging: zip `extension/`, `docs/releases.md` with version, changes, limitations and rollback (AGENTS.md *Workflow* 6). Added 2026-11-09.
- [ ] **P3** Lint/format setup (none yet). Added 2026-11-09.

## Docs

- [ ] **P3** Keep [`docs/requirements.md`](../docs/requirements.md) traceability current as slices ship (REQ → SB → tests → commit). Added 2026-11-09.
