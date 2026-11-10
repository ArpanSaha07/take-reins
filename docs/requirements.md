# Draft requirements and acceptance criteria

Status: Awaiting feature-scope review. Cloud sign-in/sync intent is approved; the details below are proposed and are not an implementation approval. Reference IDs link to the [BlockSite inventory](./discovery.md).

| Requirement | User outcome / reference | Proposed acceptance criteria |
| --- | --- | --- |
| REQ-01 | Manage distracting sites; BS-01/02 | Given a valid approved domain rule, saving it updates enforcement; deleting that rule removes its effect unless another active rule still blocks it. Invalid inputs do not corrupt the last valid configuration |
| REQ-02 | Block URL keywords and categories; BS-03/04 | Keyword matching uses the approved URL semantics; selecting a category activates a versioned, legally usable dataset. Test allowed near-matches and document classification gaps |
| REQ-03 | Allowlist mode; BS-05 | Approved allowed domains work and other supported HTTP(S) top-level navigations are blocked. A documented recovery path remains available; dependencies and precedence are specified before implementation |
| REQ-04 | Schedules; BS-06 | Blocking transitions at specified local boundaries, including overnight periods and DST, and reconciles after restart/sleep. The time-zone policy is explicit |
| REQ-05 | Focus sessions; BS-07 | Focus and break transitions follow approved durations; closing the popup or restarting the worker does not reset the session; cancellation/early exit follows approved policy |
| REQ-06 | Daily limits and insights; BS-08/09 | Only approved active-time intervals are counted; duplicates are not counted twice; midnight/reset rules are explicit; charts match known synthetic usage records |
| REQ-07 | Friction and blocked-page experience; BS-10–15 | Approved locks/challenges, temporary exceptions, text/images and redirects follow their spec; invalid/looping redirects are rejected; no claim of uninstall prevention |
| REQ-08 | Google sign-in; user decision | Google sign-in works in Chrome and Edge; cancellation leaves a usable state; invalid/replayed callbacks are rejected; refresh and sign-out behave as specified; no client secret is shipped |
| REQ-09 | Online profile/settings sync; user decision and BS-16/17 | One account's approved changes reach its second browser; another account cannot read/write them; conflicting changes are surfaced; offline changes survive restart; retries are idempotent |
| REQ-10 | Online usage statistics; user decision | Approved aggregates sync across browsers without duplicate ingestion; queries respect dates/time zone and user ownership; no data beyond the approved field/retention scope is uploaded |
| REQ-11 | Account/data control; proposed support for cloud scope | Own data can be exported and deleted through approved flows; revoked sessions cannot continue syncing; a stale device cannot recreate deleted account data |
| REQ-12 | Private browsing and accessibility; BS-19 | Explain browser-managed private-mode permission; verify behavior with/without permission; private statistics follow approved policy. All core controls work by keyboard and expose labels/errors |
| REQ-13 | Optional parity extras; BS-13/20/21/22 | Rewards, uninstall alerts, list-capacity targets and localization are separately selected and specified; no implicit requirement for paid subscriptions or monetization |
| REQ-14 | Reliability, cost and delivery | Last valid blocking config survives backend outage; quota errors are visible and retried safely; approved workload fits the agreed budget; actual packaged build passes both-browser acceptance |

Before approving a feature, expand its row into a feature specification covering screens, state transitions, validation, error recovery, permissions, matching precedence, test cases and explicit exclusions. The [decision log](./decisions.md) tracks unresolved behavior.
