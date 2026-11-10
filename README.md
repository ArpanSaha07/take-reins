# Take Reins — Focus & Website Blocker

*Take reins of your life.* A personal Chrome / Microsoft Edge extension (Manifest V3) that blocks the sites you list, with short timed unblocks.

Current scope: [Slice 1 spec](docs/specs/simple-blocker.md) — block list, per-site 5/10/15-minute unblock, stopwatch countdown on the toolbar icon during the last 2 minutes, +1/+2 min extensions. Everything is stored locally; no accounts, sync or analytics yet.

## Install (unpacked)

1. Chrome: open `chrome://extensions`. Edge: open `edge://extensions`.
2. Turn on **Developer mode**.
3. Click **Load unpacked** and select the `extension` folder of this project (`D:\take-reins\extension`).
4. Pin the Take Reins icon to the toolbar so the countdown badge is visible (puzzle-piece menu → pin).
5. Optional: to block in Incognito/InPrivate windows too, open the extension's **Details** and enable **Allow in Incognito** / **Allow in InPrivate**.

Windows may hide notifications while *Focus assist / Do not disturb* is on; the popup's +1/+2 buttons always work.

## Use

- Click the icon, type a site (e.g. `youtube.com`, or paste any URL) and press **Block**. Subdomains are blocked too.
- Visiting a blocked site shows the Take Reins page with **Unblock for 5 / 10 / 15 min**; the page you wanted then opens.
- While unblocked, the badge shows minutes left (`7m`). In the last 2 minutes the icon turns into a stopwatch and the badge counts down `1:59 … 0:01`; a notification offers **+1 min / +2 min** (also in the popup).
- At zero, open tabs of that site switch to the blocked page.

## Update / rollback

- **Update**: replace the files in the `extension` folder, then click the reload ↻ button on the extension card. Your list is kept.
- **Roll back**: put the previous version's `extension` folder back in place and click reload ↻. Settings are kept as long as the extension is not removed.
- **Uninstall**: click **Remove** on the extension card. This deletes the block list and timers.

## Development

Requires Node.js 20+ (tested with 24.22.1).

```sh
npm install          # dev-only: puppeteer-core for browser tests
npm test             # unit tests (node --test)
npm run e2e:chrome   # real-browser acceptance run, throwaway profile, local test server
npm run e2e:edge
npm run icons        # regenerate icons/ from scripts/make-icons.mjs
```

Layout: `extension/core/*` holds the pure, unit-tested logic (domain normalization, state transitions, badge/countdown, DNR rule building); `extension/background.js` applies it to the browser; `popup.*` and `blocked.*` are the UI.

## Permissions

| Permission | Purpose |
| --- | --- |
| `declarativeNetRequest` | Redirect navigations to blocked sites to the Take Reins page |
| `storage` | Keep the block list and unblock end times on this device |
| `alarms` | Wake up for the countdown start and unblock end |
| `notifications` | "+1 / +2 min" prompt when the countdown starts |
| Host access to http/https sites | Chrome requires it for *redirect* rules, and to switch already-open tabs of a re-blocked site. No page content is read. |

## Limitations

- An extension can be disabled or removed at any time from the extensions page; Take Reins does not prevent that.
- Only top-level http/https navigations are blocked (not embedded frames, other browsers, or apps).
- The countdown badge updates while the browser is running. If the computer sleeps through the end of an unblock, the site is re-blocked as soon as the browser wakes.
