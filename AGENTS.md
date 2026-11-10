# Project instructions

## Objective
Build an original, personal productivity browser extension for Google Chrome and Microsoft Edge, informed by observed BlockSite browser behavior. Mobile applications are outside scope.

## Workflow and approval
1. Inspect the workspace before modifying existing work.
2. Record reference observations with source, date, version when available, evidence, and limitations. Separate observations from proposed behavior.
3. Produce requirements, architecture, acceptance criteria, a test plan, and a phased backlog before feature implementation.
4. Obtain the user's approval of the concrete specification before implementing features. Record the approved scope and decisions.
5. Use test-driven development: write a meaningful failing test, implement the smallest change, then refactor and run relevant checks. Record actual results; never report an unexecuted check as passing.
6. Release only after the approved acceptance criteria are verified in both Chrome and Edge. Provide unpacked installation and rollback instructions.

## Engineering rules
- Use Manifest V3 and document each permission and its purpose.
- Keep blocking decisions deterministic and independently testable. Account for service-worker restarts, browser restart, sleep, local time, and daylight-saving changes.
- Store personal settings locally by default. Do not introduce accounts, analytics, remote code, or cloud services without an approved requirement.
- Validate all input, messages, imports, and stored data; render user values as text and use a restrictive content security policy.
- Use original code, branding, copy, and assets. Reference analysis informs behavior and does not authorize copying proprietary implementation or assets.
- Keep reference inspection scoped to BlockSite. Avoid collecting unrelated browsing history, credentials, or account data.
- Preserve the user's BlockSite configuration. Document and restore any temporary inspection changes.
- Do not claim an extension prevents disabling, uninstalling, or every browser-level bypass.
- Do not commit secrets, captured private profile data, dependency directories, or generated browser profiles.

## Documentation
Maintain traceability from requirement IDs to acceptance tests and implementation milestones. Keep decision records, known limitations, test results, and release instructions current.
