---
name: commit-msg
description: Write a Conventional Commits message for the current Take Reins changes from the real diff. Use when asked for a commit message, or at the end of a unit of work before Arpan commits.
---

# Commit message

Arpan reviews, commits and pushes. Write the message; **do not run `git commit` or `git push`** unless he asks in this session.

## 1. Read the changes

```sh
git status --short
git diff --staged        # if nothing is staged, use: git diff   (and say so)
git log --format=%s -10  # match recent style
```

- Read untracked (`??`) files that matter — new files never show in a diff.
- Large diff: start with `git diff --staged --stat`, then read the significant files.
- **Stop if a secret or private data is staged** (`.env`, keys, tokens, browser profiles, `node_modules/`, captured BlockSite/profile data). Report it and stop.

## 2. Format

```text
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:** `feat` · `fix` · `docs` · `style` · `refactor` · `perf` · `test` · `build` · `ci` · `chore` · `revert` — pick the dominant change. Two unrelated halves → suggest splitting.

**Scopes (optional):** `core` (extension/core) · `worker` (background.js) · `popup` · `blocked` (blocked page) · `manifest` · `icons` · `tests` · `e2e` · `docs` · `agents` (.agents/, AGENTS.md) · `deps` · `ci`.

**Subject:** imperative, lowercase, no period, ≤ 50 characters including the prefix (never over 72). Say the outcome, not the mechanism: `fix(popup): keep extend buttons clickable during countdown`, not `fix(popup): change render function`.

**Body:** wrap at 72. Why the change was needed and what it does; reference ids (SB-04, REQ-01, BUG-001, DEC-09). State what was verified and what was not.

**Footer:** `Refs: BUG-001` / `BREAKING CHANGE: …` when relevant.

## 3. Deliver

Show the message in a fenced block, plus the staging command if needed (`git add …`). Mention anything unstaged that looks like it belongs in the commit.
