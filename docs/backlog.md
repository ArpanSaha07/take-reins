# Phased implementation plan

Status: Draft for review. No feature implementation or deployment authorized by this document. See [requirements](./requirements.md), [architecture](./architecture.md), [tests](./test-plan.md), and [open decisions](./decisions.md).

**2026-11-09:** Slice 1 ([simple blocker with timed unblock](./specs/simple-blocker.md), DEC-08–11) is implemented in `extension/`; see [validation](./validation.md). The latest request prioritizes basic features first. Review [the basic-release proposal](./basic-release-plan.md) for a smaller first build and staged delivery of schedules, focus, accounts, and statistics. The broader phases below remain the overall backlog, not a requirement to finish cloud work before the first local build.

| Phase | Deliverables | Dependencies / exit gate | State |
| --- | --- | --- | --- |
| P0 Discovery | Complete selected-version REA package analysis, scoped UI inventory, controlled behavior notes, gaps/paywall list | User selects reference version; scoped Chrome access; label all evidence and unknowns | Partial; public inventory recorded |
| P1 Product specification | Release scope, feature specs, wireframes, matching/precedence, time/usage definitions, privacy fields/retention | Product-owner review and explicit acceptance-criteria approval | Pending |
| P2 Architecture and cloud spike | Stack decision; Google sign-in prototype in Chrome/Edge; provider authorization proof; quota/cost estimate; schema and sync contracts | Resolve pilot size/budget/region; compare free tiers; approve architecture and provider before provisioning | Planned |
| P3 Extension foundation | MV3 project, local core/store, popup/settings, browser adapter, build pipeline, meaningful first rule tests | P1/P2 approvals; T-01/02/09 tests; install same source in both browsers | Planned |
| P4 Core productivity | Approved domain/keyword/allowlist rules, schedules, focus and blocked-page experience | Slices of REQ-01–05/07; TDD and browser acceptance per feature | Planned |
| P5 Accounts and online data | Google sign-in, own-profile editing, device identity, authorization policies, settings delta sync and account isolation | REQ-08/09; T-05–07; first-login/conflict/sign-out behavior approved | Planned |
| P6 Usage and insights | Local active-time measurement, daily limits, batched aggregate sync and insight charts | REQ-06/10; usage/privacy/retention decisions; T-04/08/10 | Planned |
| P7 Selected advanced parity | Categories, locks/challenges, customization, localization and any specifically selected extras | Each feature separately specified; category licensing and lock limitations resolved | Planned |
| P8 Hardening and pilot | Export/deletion, migration/restore, quota/offline recovery, accessibility, security review and cost measurement | REQ-11/12/14; account deletion cannot be postponed past cloud release | Planned |
| P9 GitHub and release | Reviewed commits/PRs, green CI, packaged build, release notes, installation/rollback, product acceptance | User supplies GitHub destination and publishing authorization; both-browser matrix passes | Planned |

GitHub work can happen incrementally from the documentation/foundation phases once authorized; P9 is the final delivery gate, not a reason to defer version control until the end. No remote has been created or pushed to by this plan.

## Proposed GitHub workflow

- Track approved features as issues with requirement IDs and acceptance criteria.
- Work on focused branches and include tests/docs in the same change.
- PR checks: static checks, meaningful unit/integration tests, authorization rules/schema tests, and Chrome/Edge extension builds. Record manual browser verification separately.
- Deploy an isolated staging environment only after authorization. Production migrations and deployment follow the approved review process; secrets remain outside source control.
- Review the final diff and validation evidence before commit/push/PR/merge actions. Follow the applicable client skill and [workflow](../workflow.md).

## Milestones to approve

1. Evidence-backed inventory and chosen first-release features.
2. Architecture, profile/statistics data contract, sign-in flow and hosting/cost boundary.
3. Testable extension foundation and core blocking behavior.
4. Google sign-in plus reliable cross-browser profile/settings sync.
5. Measured usage, statistics sync and insights.
6. Accepted pilot build and authorized GitHub/cloud delivery.

Duration estimates will follow the reference inspection and scope decisions; none are invented here. Full observed parity is a larger scope than the initial core-plus-cloud milestones.
