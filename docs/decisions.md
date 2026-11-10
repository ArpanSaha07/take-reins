# Decisions and open questions

Date: 2026-10-25 America/Toronto. Follow [workflow](../workflow.md).

## Recorded user decisions

| ID | Decision | Status |
| --- | --- | --- |
| DEC-01 | Take Reins identity, tagline, listing title, repository name and mission in [PRODUCT.md](../PRODUCT.md) | Approved |
| DEC-02 | Chrome and Edge browser extension; mobile excluded | Approved scope |
| DEC-03 | Google sign-in | Approved requirement; detailed flow pending |
| DEC-04 | Online sync for user profile, settings and usage statistics | Approved requirement; field-level scope pending |
| DEC-05 | Use the cheapest hosting/cloud deployment options | Approved cost objective; provider selection pending |
| DEC-06 | Ask about unresolved choices; report tool failures | User instruction |
| DEC-07 | Specs and acceptance criteria approved before feature implementation; use TDD | User instruction |
| DEC-08 | 2026-11-09: First build = [simple blocker with timed unblock](./specs/simple-blocker.md); local only, cloud/sign-in deferred | Approved |
| DEC-09 | Timed unblock applies to one site, each with its own timer; options 5/10/15 min | Approved |
| DEC-10 | Stopwatch icon + `m:ss` badge countdown during the last 2 minutes | Approved |
| DEC-11 | +1/+2 min in popup and in a countdown notification; subdomains blocked; open tabs redirected on re-block; plain JS + `node --test`; broad host access for DNR redirects | Approved |

## Open decisions

| ID | Question | Dependency |
| --- | --- | --- |
| OPEN-01 | Analyze BlockSite 7.1.1 Default, 6.8.2 Profile 1, or both? | REA package analysis |
| OPEN-02 | Dedicated BlockSite-only window was provided and its dashboard read successfully; latest reconnect timed out waiting for app approval. Restore tool access to inspect remaining panes | UI inspection |
| OPEN-03 | Which observed features belong in the first release? | Feature specification approval |
| OPEN-04 | Is this initially personal use, a small private pilot, or a public release? Expected active users? | Cost model and operational requirements |
| OPEN-05 | Must hosting remain strictly $0 with service limits, or is a small paid ceiling acceptable? What ceiling and currency? | Final provider and deployment approval |
| OPEN-06 | Which profile fields should be stored: display name, email, avatar, time zone, goals? Which are editable? | Schema and consent |
| OPEN-07 | May statistics include domain names, or only categories/totals? Retention period? Private-browsing exclusion? | Usage schema and privacy specification |
| OPEN-08 | When browsers are used simultaneously, should usage be summed or deduplicated as wall-clock time? | Sync/statistics semantics |
| OPEN-09 | Should sign-out retain local blocking settings? How should first-login conflicts be resolved? | Account and sync UX |
| OPEN-10 | Approve provider, data region, stack and minimum browser versions? | Technical foundation |
| OPEN-11 | Which GitHub owner/repository, visibility, license and review process? | GitHub setup and delivery |
| OPEN-12 | Which password/challenge/bypass behavior, category data source and custom assets are needed? | Advanced features |

The user's cloud request expands the planning scope beyond the original local-only default. It does not authorize uploading existing browser data, creating paid services, or deploying an unreviewed implementation.
