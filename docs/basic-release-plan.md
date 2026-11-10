# Basic features first: proposed scope and sequence

Status: Awaiting the product owner's scope choice. No implementation has started. This proposal uses the [feature inventory](./discovery.md), existing [requirements](./requirements.md), [architecture](./architecture.md), and [test strategy](./test-plan.md).

## First build: core blocking

Recommended smallest usable slice for approval:

| ID | Feature | Proposed behavior | Acceptance example |
| --- | --- | --- | --- |
| BASIC-01 | Add/list/remove website rules | Original popup/settings UI with validated domain entries and clear errors | Add `example.com`; it appears once. Removing it removes its blocking effect if no other active rule applies |
| BASIC-02 | Domain enforcement | Block supported HTTP(S) top-level navigations using MV3 browser rules | `example.com` is blocked; `notexample.com` is allowed. Subdomain treatment requires the decision below |
| BASIC-03 | Blocking on/off | Explicit state shown in popup and settings; retain the list while off | Turn off, navigate successfully, turn on, then observe blocking again |
| BASIC-04 | Simple blocked page | Original Take Reins message and a route to settings; no upload/customization yet | A blocked navigation reaches the packaged page without a redirect loop or exposing unescaped input |
| BASIC-05 | Local persistence | Save list and master state; reconcile after browser/worker restarts | Restart the browser and verify the same rules and state; a failed update preserves the last valid browser configuration |
| BASIC-06 | Chrome and Edge installation | One maintained codebase, minimal documented permissions, unpacked install instructions | Install and verify BASIC-01–05 independently in both branded browsers |

These are proposed Take Reins behaviors. A visible BlockSite label does not establish its exact matching, toggle or persistence semantics.

## Decisions needed before the first build

1. Should blocking a domain include all its subdomains? Recommendation: yes, with exact domain boundaries.
2. Should path-specific URLs be supported immediately, or should the first build accept domains only? Recommendation: domains first, with an explicit UI explanation rather than silently discarding paths.
3. Should the on/off control be unrestricted? Recommendation: unrestricted initially; password/challenge friction comes after reliable enforcement.
4. Should the first usable build require Google sign-in? Recommendation: core blocking works before sign-in; add the already requested cloud features in a later milestone. This changes sequencing, not the approved overall cloud scope.
5. Approve language/build/test tooling before creating the project scaffold. Select based on the approved scope and maintainability rather than treating a stack as already chosen.

## Subsequent slices

| Order | Slice | Why after the core | Test gate |
| --- | --- | --- | --- |
| 2 | Scheduled blocking | Reuses proven rule application; introduces clock and recovery behavior | Selected days, boundaries, overnight windows, DST, delayed alarms, sleep/restart |
| 3 | Focus/break sessions | Reuses scheduling/state persistence | Focus→break transitions, cancellation policy, popup closure, restart recovery |
| 4 | Google sign-in and profile/settings sync | Adds account isolation, provider setup and offline conflict handling | Real Google flow in Chrome/Edge; user A/B isolation, retries, conflicts, sign-out/account switching |
| 5 | Usage measurement, limits, insights and statistics sync | Requires an explicit definition of active time, retention and aggregation | Idle/tab/window events, daily boundary, duplicate/out-of-order uploads, simultaneous browsers |
| 6 | Selected advanced features | Categories, allowlist, keywords, import/export, locks, custom assets and redirects add independent edge cases | Separate approved specs and tests for each selected feature |

Google sign-in and online profile/settings/statistics storage remain requirements. Hosting selection stays pending; no account creation, resource provisioning or paid deployment is implied here.

## Development steps after approval

1. Expand the selected scope into exact acceptance cases and a permission list.
2. Establish the project/build setup and test runner; record baseline browser versions.
3. Write and run failing domain-validation/matching tests with boundary examples.
4. Implement minimal pure rule logic; observe green before refactoring.
5. Add storage/browser-adapter failure tests, then implementation.
6. Add popup/settings and blocked page; verify input safety and keyboard use.
7. Exercise real navigation and restart behavior in disposable Chrome and Edge test profiles.
8. Update documentation and validation records. Commit/push through the existing [workflow](../workflow.md) only when authorized.

## Reviewable completion criteria

The selected BASIC criteria pass in both browsers; no dependency on cloud availability for local enforcement; no unapproved data uploads; install/disable/uninstall behavior documented; meaningful tests and actual results recorded. Any deferred criterion is explicitly removed from the build scope rather than marked passed.

## Current investigation gap

Main dashboard controls were observed, but individual panes and enforcement tests remain unverified. The latest computer-use connection timed out waiting for app approval. A reference-version choice is still needed before REA package analysis. Continue that investigation when access is restored and update this proposal if new evidence changes the scope.
