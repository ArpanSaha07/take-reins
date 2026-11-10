# BlockSite browser discovery

Status: Partial investigation. Official documentation and one installed dashboard screen reviewed; individual feature screens, enforcement behavior and REA package analysis remain pending. This is not a claim of complete feature parity.

Research date: 2026-10-25 America/Toronto (2026-10-26 UTC). Scope: Chrome and Edge browser extension only.

## Evidence and access

- Earlier local manifest inspection found extension ID `eiimnmioipafcokbfikbljfdeojpcgbh`, version 7.1.1 in Chrome Default and 6.8.2 in Profile 1. Both declare Manifest V3, a service worker, popup, declarative network request permission, storage, and alarms. These are package declarations, not runtime results. The user has been asked which version to analyze.
- Earlier Chrome window inspection showed BlockSite tabs. Current whole-window selection was rejected by automatic approval review because unrelated private content was visible, including after manual approval. No tab-scoped browser connection was listed. No further whole-window retries will be made until the context changes.
- REA MCP `binary_session` responded and reported no active binary target. This verifies REA connectivity only. No feature-analysis Evidence IDs have yet been produced.
- The command runner previously failed to start; Node filesystem access and patch writing work.
- One account help link returned a web cache-miss error. Other cited articles were accessible.
- No BlockSite settings were changed, subscriptions purchased, credentials entered, or browsing history collected for this investigation.

## Feature inventory

Evidence levels: D = described by official browser help; L = listed by the publisher in its Chrome store listing; M = marketed by the general site and needs platform confirmation. The dashboard observations below establish visible UI only, not successful feature execution. Free/Premium availability can vary by version and account.

| ID | Feature | Documented behavior | Evidence / limits |
| --- | --- | --- | --- |
| BS-01 | Website block list | Add distracting sites through the toolbar/settings dashboard | D, S1; exact matching rules untested |
| BS-02 | Remove/unblock sites | Delete a list entry to unblock that website | D, S2; interactions with other rules untested |
| BS-03 | URL keyword blocking | Match words in URLs rather than page text; single words without spaces; does not hide search results | D, S3 |
| BS-04 | Category blocking | Add predefined categories, including Adult, Social, and Shopping | D, S4; Adult described as free and other categories Premium; catalog completeness unknown |
| BS-05 | Allowlist mode | Permit listed sites and block other sites while the mode is enabled | D, S5; restricted browser pages and dependent domains need testing |
| BS-06 | Scheduled blocking | Apply blocking on selected days and times | L, S6; overlap, overnight and time-zone behavior untested |
| BS-07 | Focus/Pomodoro mode | Alternate focus periods with breaks | L, S6; controls, cycle limits and restart behavior untested |
| BS-08 | Daily usage limits | Block a site after its configured daily allowance is used | L, S6; active-time counting and reset semantics untested |
| BS-09 | Insights | Show time spent, browsing categories, trends and claimed time saved | L, S6; calculation methods unverified |
| BS-10 | Settings password protection | Require a password before opening protected settings | D, S7; separate from account sign-in |
| BS-11 | Password-based blocked-site access | Allow access after password entry | D, S7; exception duration/scope untested |
| BS-12 | Blocked-page challenge | Add an unlock step such as reversing a word | D, S7; availability in installed versions unverified |
| BS-13 | Uninstall email notification | Send an alert after removal | D, S7; delivery guarantees unverified; not uninstall prevention |
| BS-14 | Custom blocked page | User-selected image and text | L, S6; upload restrictions and storage unverified |
| BS-15 | Site redirect | Send a blocked navigation to a selected alternative site | L, S6; loop protection untested |
| BS-16 | Accounts and subscription entitlement | An account carries subscription access across supported products | D, S8; login providers, profile fields and server internals unknown |
| BS-17 | Automatic desktop block-list sync | Sign into the same account in Chrome/Edge to sync lists | D, S9; transport, latency, conflict resolution and synced-field coverage unknown |
| BS-18 | Shared desktop list behavior | Help says sync cannot be disabled while remaining signed in; Groups described as future work | D, S10; do not count Groups as released |
| BS-19 | Incognito/InPrivate support | Requires the user to enable the extension in private browsing settings | D, S11; permission has not been changed |
| BS-20 | Rewards notification control | Settings can disable rewards notifications | D, S12; reward mechanics/value unverified |
| BS-21 | Unlimited list capacity | Marketed on the focus page | M, S13; actual quotas, plan limits and browser rule limits unverified |
| BS-22 | Language support | Chrome listing reports 17 languages | L, S6; localization quality and per-version coverage unverified |
| BS-23 | Block-list export | Export control visible on the installed dashboard | UI-01; file format, contents and behavior untested |
| BS-24 | Block-list import | Import control visible on the installed dashboard | UI-01; validation, format and merge/replace semantics untested |
| BS-25 | Blocking status/control | Dashboard includes a Blocking label and adjacent control group | UI-01; toggle behavior and persistence untested |
| BS-26 | Specific URL/path entries | Dashboard renders both a domain entry and a path-containing website entry | UI-01; exact-path/prefix/subdomain matching untested |

## Installed dashboard observation: UI-01

Captured in the prior successful Chrome access check on 2026-10-26. Source: computer-use accessibility tree for dedicated BlockSite window 18549054, at `user.blocksite.co/options/BLOCK_SITES`. This is a UI observation reference, not a REA Evidence ID. Installed version not established from this screen.

- Navigation: Block Sites, Usage Limit, Insights, Focus Mode, Password Protection, Custom Block Page, Settings, About.
- Block Sites screen: Block List, Redirect, Schedule, Add to Block List, Blocked Items, Whitelist mode, Export, Import.
- List items have Website and Category types. The screen renders domain and path-containing entries and Adult/News category entries. Personal list contents are intentionally omitted from this report.
- Account menu: View Account, Insights, Rewards, Settings, Support, Log Out.
- A Blocking label/control group and reward counters are visible; values and behavior are not analyzed.
- A Windows beta promotion is visible but is outside the browser-extension scope.

No individual feature pane was opened during UI-01, no button behavior was tested, and no settings were changed. A later attempt to reconnect failed because the stored window binding no longer existed in the tool runtime; rebinding then timed out waiting for app approval. The current blocker differs from the earlier whole-window scope rejection.

The listing also uses uninstall-prevention and mobile-sync language. Browser help instead describes uninstall email alerts and currently differentiates desktop sync from mobile support. Treat marketing as a lead to verify, not an enforcement guarantee. Native app blocking, mobile features, ad blocking, and enterprise device control are outside this browser-extension scope.

## How the documented browser workflow fits together

1. The toolbar opens a popup; settings lead to an options/dashboard surface. Help links point to `user.blocksite.co/options/BLOCK_SITES`.
2. The user adds sites, URL words, or categories and can choose allowlist behavior, schedules, focus sessions, or usage limits.
3. A restricted navigation is blocked, redirected, or shown a blocked page. Password/challenge controls can add friction to changes or exceptions.
4. Insights report measured browsing behavior. A signed-in account can synchronize desktop lists.

This is a synthesis of public documentation and manifest declarations. It does not establish BlockSite's internal backend architecture, database, authentication provider, exact rule precedence, or runtime correctness.

## Remaining inspection checklist

| Question | Status | Evidence still needed |
| --- | --- | --- |
| Which installed version is the reference? | Open | User selects 7.1.1, 6.8.2, or both |
| What menus/settings actually exist? | Partial | Main dashboard/navigation verified in UI-01; reconnect after app-approval timeout to inspect individual panes |
| What code/configuration supports each feature? | Pending | REA static analysis of selected installed package |
| How do blocking, scheduling and focus behave? | Pending | Controlled disposable-rule tests after test actions are agreed |
| What is restricted by the current account/plan? | Unknown | UI evidence without buying/upgrading |
| How do account and sync screens work? | Pending | Scoped observation; no need to expose credentials |
| What are the backend internals? | Unknown | Public UI/package cannot establish private server implementation |

## Sources

- S1: [Add websites](https://blocksite.zendesk.com/hc/en-us/articles/360019467337-How-to-block-websites-on-the-browser-extension)
- S2: [Unblock a website](https://blocksite.zendesk.com/hc/en-us/articles/35358583332637-How-to-unblock-a-website-in-the-extension)
- S3: [URL keyword blocking](https://blocksite.zendesk.com/hc/en-us/articles/360019467357-How-do-I-block-specific-keywords-Extension)
- S4: [Browser categories](https://blocksite.zendesk.com/hc/en-us/articles/33022428917789-How-to-block-categories-on-the-Browser-Extension)
- S5: [Allowlist mode](https://blocksite.zendesk.com/hc/en-us/articles/360019645138-What-is-Whitelist-Mode-and-how-to-use-it)
- S6: [Publisher Chrome listing](https://chromewebstore.google.com/detail/blocksite-block-websites/eiimnmioipafcokbfikbljfdeojpcgbh?hl=en)
- S7: [Browser password controls](https://blocksite.zendesk.com/hc/en-us/articles/33219027982877-How-to-enable-Password-Protection-on-the-Browser-Extension)
- S8: [Getting started and accounts](https://blocksite.zendesk.com/hc/en-us/articles/360019466917-How-do-I-use-BlockSite-Getting-Started)
- S9: [Desktop sync](https://blocksite.zendesk.com/hc/en-us/articles/32609316831901-How-to-sync-my-block-list-across-multiple-browsers)
- S10: [Separate desktop lists and future Groups](https://blocksite.zendesk.com/hc/en-us/articles/32609506700957-Can-I-disable-sync-or-have-different-block-lists-on-different-desktop-browsers-devices)
- S11: [Private browsing support](https://blocksite.zendesk.com/hc/en-us/articles/36383792971037-How-to-Enable-BlockSite-in-Incognito-or-InPrivate-Mode)
- S12: [Rewards notification settings](https://blocksite.zendesk.com/hc/en-us/articles/8003719645853-How-to-turn-off-the-rewards-notification-Extension)
- S13: [General focus feature marketing](https://blocksite.co/focused)
- S14: [Current desktop/mobile sync distinctions](https://blocksite.zendesk.com/hc/en-us/articles/32609425309853-Does-BlockSite-sync-between-mobile-and-desktop-browsers)
