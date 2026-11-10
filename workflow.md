# Take Reins development workflow

Status: Working process requested by the product owner. Feature scope, technology choices, and GitHub destination remain subject to explicit decisions.

This workflow covers the Chrome and Microsoft Edge browser extension, from product discovery through maintenance. Mobile applications are outside scope. Follow [AGENTS.md](./AGENTS.md) and the approved identity in [PRODUCT.md](./PRODUCT.md).

## 1. Working agreement

- The product owner decides product goals, feature scope, priorities, user experience, and release readiness.
- The development agent researches, prepares reviewable specifications, writes tests and code, reports evidence, and carries out authorized GitHub work.
- Ask questions about unresolved choices instead of silently choosing defaults. Mark unanswered items as open decisions; continue only work that does not depend on those answers.
- Report a tool failure when it occurs, including its practical impact, any safe alternative, and what help is needed. Do not describe attempted operations as completed.
- Keep product approval, technical verification, and permission to publish separate. Approval of this workflow does not approve an unfinished feature specification or authorize a GitHub push.
- Record decisions from the conversation in project documentation so they survive future sessions.

## 2. Documentation set

The following paths are planned documents, created when their phase begins. Keep documentation proportionate to the work; use short tables and linked records instead of duplicating specifications.

| Document | Purpose | Update point |
| --- | --- | --- |
| `AGENTS.md` | Project instructions and engineering constraints | When an agreed project rule changes |
| `PRODUCT.md` | Approved identity, mission, audience, and product goals | After a product decision |
| `workflow.md` | SDLC, review, and delivery process | When the process changes |
| `docs/discovery.md` | REA findings, observed workflows, evidence, and limitations | During reference investigation |
| `docs/requirements.md` | Requirement IDs, user stories, scope, priorities, and acceptance criteria | Before feature implementation and after approved scope changes |
| `docs/specs/<feature>.md` | Feature behavior, states, validation, edge cases, and UX | Before each feature is approved |
| `docs/architecture.md` | Components, data flow, storage schema, permissions, and trust boundaries | Before foundation work and when the design changes |
| `docs/decisions.md` | Open questions and dated decisions with reasons and approval references | At every material decision |
| `docs/test-plan.md` | Test strategy, environments, requirement coverage, and browser matrix | Before development and when coverage changes |
| `docs/backlog.md` | Phases, dependencies, priorities, owners, and delivery status | During planning and execution |
| `docs/validation.md` | Commands, environments, observed outcomes, and unresolved failures | At each verification gate |
| `README.md` | Setup, development commands, build, and unpacked installation | When runnable project setup exists |
| `docs/releases.md` | Versioned changes, known limitations, migrations, and rollback | Before each release |

Every specification must show its status: Draft, Awaiting approval, Approved, Implementing, Verified, or Released. Approval records identify the exact revision or dated scope and the user's decision. A changed requirement returns the affected scope to review.

## 3. Discovery and reference analysis

1. Inspect existing workspace instructions and preserve existing work.
2. Resolve which Chrome profile and BlockSite version the user wants inspected before selecting an ambiguous target.
3. Use the REA skill and available MCP tools to examine the installed browser extension. Use browser control for relevant UI observations when needed.
4. Record each finding with a finding ID, target/version, observation date and time zone, source or REA Evidence ID, evidence type, coverage boundary, and remaining unknowns.
5. Distinguish static package facts, observed runtime behavior, and inferred behavior. UI labels alone do not prove enforcement behavior.
6. Map browser workflows such as list editing, blocking, scheduling, focus sessions, and settings only where the evidence supports them. Mark inaccessible or paid functionality as unverified.
7. Preserve the user's BlockSite settings. Ask before inspection changes whose behavior or impact has not been agreed, and record restoration outcomes.
8. Translate relevant behavior into original Take Reins requirements, code, branding, copy, and assets.

Exit gate: The product owner can review the observed feature inventory, evidence limitations, and outstanding questions. Discovery is not complete while required inspection questions remain unanswered.

## 4. Product definition and feature approval

For each proposed feature, document:

- The user problem, intended outcome, and priority.
- A stable requirement ID such as `REQ-001` and a short user story.
- Included behavior and explicit exclusions.
- Screens, interactions, empty states, validation errors, and recovery paths.
- Observable Given/When/Then acceptance criteria, including boundary cases.
- Permissions and personal data needed, storage location, and retention behavior.
- Dependencies, risks, known browser restrictions, and open questions.

Present a concrete specification and phased backlog for approval. Ask the product owner to resolve choices such as release scope, settings synchronization, bypass behavior, and feature priorities. Record the answer rather than inferring approval from silence.

Exit gate: The relevant specification and acceptance criteria are explicitly approved. No feature implementation starts before this gate.

## 5. Technical design

1. Propose the language, UI approach, build tooling, test tooling, and supported browser baseline for review; do not treat these as already selected.
2. Design a Manifest V3 extension with documented boundaries between the service worker, popup, options/settings UI, blocking page, and any necessary content scripts.
3. Keep URL matching, rule compilation, scheduling, and focus-state logic deterministic and independently testable.
4. Document storage schemas, validation, migrations, message contracts, permission rationale, and handling of browser API failures.
5. Address service-worker termination, restart, browser restart, delayed alarms, sleep/wake, time-zone changes, daylight-saving changes, and conflicting rules.
6. Assess security and privacy: restrictive CSP, no remote executable code, safe rendering, message validation, least-required permissions, and no unapproved telemetry or cloud services.
7. Document browser limitations, including restricted pages and the ability to disable or uninstall the extension.

Exit gate: The architecture supports the approved acceptance criteria, material technical choices are resolved, and the test plan covers the identified risks.

## 6. Test-driven implementation

Deliver one small, traceable feature slice at a time.

1. Select an approved requirement and link its acceptance criteria to the work item.
2. Write a meaningful test that fails because the required behavior is absent. Run it and record the expected failure; a broken test environment is not a valid red step.
3. Implement the smallest coherent change that makes the test pass.
4. Refactor while keeping relevant tests green.
5. Add integration or browser tests where pure logic tests cannot establish the behavior. Use manual verification for behaviors that require the actual Chrome or Edge runtime.
6. Run the relevant regression checks, type checks, lint, and build checks supported by the selected toolchain. Broaden testing when risk or new failures justify it.
7. Update specifications, architecture, and validation records when implementation clarifies behavior. Return material behavior changes to the product owner for approval.

For bug fixes, reproduce the defect with a failing regression test before correcting it where feasible. Explain any exception to test-first work. Documentation-only changes need link and content review rather than artificial code tests.

## 7. Verification and acceptance

Maintain a traceability table: requirement ID → acceptance criterion → automated/manual test → result → delivery reference.

The test plan must cover approved behavior and applicable risks, including URL normalization, domain boundaries and subdomains, persistence, rule updates, schedule boundaries, focus transitions, malformed inputs, permission failures, and restart recovery. Include keyboard accessibility and readable error states for the UI.

Verify the unpacked extension separately in Google Chrome and Microsoft Edge. Record browser versions, OS, extension version or commit, steps/commands, expected result, actual result, and evidence. Separate Passed, Failed, Not run, and Blocked results. Mocked APIs and Chromium automation do not establish a pass in both branded browsers.

A feature is done when its approved criteria pass, appropriate regression checks pass, its code is reviewed, documentation is current, and no unresolved defect prevents its intended use. A feature done locally is not automatically released.

## 8. Git and GitHub delivery

### Repository setup

Before creating a remote or publishing, ask the product owner for the GitHub account/organization, repository destination, visibility, and desired review/merge process. Confirm whether an existing repository should be used. The approved repository name is `take-reins`; its owner and visibility are still open.

Inspect local Git state and remotes before changing them. Protect unrelated edits. Prepare an appropriate ignore file before staging so secrets, private captures, browser profiles, dependency directories, and generated output are excluded. Do not add a license without an explicit licensing decision.

### Change delivery

1. Use a focused branch for approved work, following the repository's agreed naming convention.
2. Review the diff and run the checks appropriate to that change.
3. Stage only intended files and create a focused commit when the user requests or authorizes committing. Match the repository's existing commit style; ask if a new convention must be chosen.
4. Push only to the user-approved remote and branch when publishing is authorized. This document itself grants no push authorization. Do not force-push or rewrite shared history without explicit authorization.
5. Create a pull request when authorized, using the applicable repository/client skill. Describe the problem, resulting behavior, linked requirements, validation evidence, and material limitations.
6. Observe CI results. Fix relevant failures with regression coverage; report infrastructure failures without claiming a pass. Address review comments and update the PR's documentation to reflect the final scope.
7. Merge only when authorized, required checks and reviews are satisfied, and no conflict remains. Do not bypass branch protection or required checks.
8. Verify and report the actual commit, branch, PR, CI, and merge outcomes. Link the relevant GitHub resources.

Use the applicable commit, sync, PR, CI, and merge skills when carrying out those operations. Creating this workflow does not perform any of them.

## 9. Release and maintenance

1. Complete the approved acceptance matrix in both browsers and record product-owner acceptance.
2. Prepare the agreed version, reproducible build/package, release notes, permission explanation, known limitations, storage migrations, unpacked installation instructions, and rollback steps.
3. Review rollback effects on stored settings; preserve or export settings before a migration when required by the approved design.
4. Obtain release authorization before publishing a release or submitting to an extension store. Repository delivery and extension-store publication are separate actions.
5. After installation, verify the packaged version and core approved workflows. Record any defects in the backlog with reproduction steps and severity.
6. Handle maintenance through the same requirement, test, review, and delivery cycle. Reassess browser API compatibility and dependency updates when relevant.

## 10. Current checkpoints

- Completed: project instructions and approved product identity recorded.
- Completed: Chrome UI access verified.
- Partial: official-source BlockSite feature inventory and draft architecture, requirements, tests, and backlog recorded under `docs/`. Installed feature/runtime verification remains incomplete.
- Pending: REA package analysis and verification of BlockSite browser workflows; resolve reference version and scoped UI access first.
- Approved intent: Google sign-in and online profile/settings/usage-statistics synchronization using the cheapest suitable cloud options. Provider, field-level data scope, retention, and cost ceiling remain open.
- Pending: first-release scope, technical choices, and feature specification approval.
- Pending: GitHub owner, repository visibility, branching/review conventions, and publishing authorization.
- Not started: feature implementation, automated testing, GitHub publication, and release verification.
