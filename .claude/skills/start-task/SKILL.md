---
name: start-task
description: Start a Jira-tracked task — move the ticket to In Progress, set reviewers and fix version on the ticket, sync the base branch, create and push a correctly named work branch so it links to the Jira dev panel. Arguments: a Jira issue link or key (e.g. GMW-1043), optional reviewer(s) (`reviewer:name1,name2`), optional base branch override, optional `version:X.Y.Z` fix-version override.
---

# Start Task

Kick off a ticket the same way every time. Arguments (order-independent after the ticket):

1. **Jira issue URL or key** (required) — e.g. `GMW-1043` or the full link.
2. **Reviewer(s)** (optional) — `reviewer:name1,name2`, or bare names after the ticket (e.g. `/start-task GMW-1043 reviewer:lyubov`). Accept names or emails — these are resolved to **Jira users** and written to the ticket's reviewer field; GitHub handles are resolved separately at PR time.
3. **Base branch override** (optional) — `base:main` or a bare branch name that exists in the repo. Default: the repo's development branch, usually `develop`.
4. **Fix version override** (optional) — `version:2.1.0`. Otherwise derived (see step 7).

## Steps

1. **Parse the argument.** Extract the issue key from the URL or bare key (e.g. `GMW-1043`). If no argument was given, ask for the ticket link.

2. **Fetch the ticket** (Atlassian MCP `getJiraIssue`; cloudId is the site URL from the link). Fetch with `fields: ["*all"]` and `expand: "names"` in one call — you need summary, issue type, status, assignee, fixVersions, description, AND the custom reviewer field (see step 8). Show the user a one-line recap (key, title, type) so they can confirm it's the right ticket.

3. **Decide branch type from the ticket**, mapping issue type / summary intent to a conventional-commit type:
   - Bug → `fix/`
   - Story, Task, Sub-task implementing something new → `feat/`
   - Chore/infra/docs → `chore/`, `docs/`, etc.

   Branch name: `<type>/<KEY>-<short-kebab-slug-from-summary>` (e.g. `feat/GMW-1043-user-profile-role-field`). Keep the slug under ~5 words. **The issue key must appear verbatim in the branch name** — that's what links the branch to the Jira dev panel via the GitHub-for-Jira app.

4. **Sync the base branch first**:
   ```bash
   git checkout <base> && git pull --ff-only
   ```
   If the working tree is dirty, stop and ask before stashing or committing anything. If `--ff-only` fails, report it — never force or merge automatically.

5. **Create the branch off the freshly updated base and push it immediately**:
   ```bash
   git checkout -b <type>/<KEY>-<slug>
   git push -u origin <type>/<KEY>-<slug>
   ```
   The immediate push is deliberate: GitHub-for-Jira only shows the branch on the ticket's dev panel once it exists on the remote. This is the "create branch through the Jira ticket" flow, done from the CLI. After pushing, mention that the branch will appear under Development on the issue within ~a minute — don't poll.

6. **Move the ticket to In Progress**: `getTransitionsForJiraIssue` to find the transition id whose target status is "In Progress", then `transitionJiraIssue`. If the ticket is already In Progress or beyond, skip and say so.

7. **Fix version — set it on the ticket, don't just check it**:
   1. If the ticket already has a fixVersion, keep it (report it) unless the user passed `version:` explicitly.
   2. Otherwise determine the target version: the `version:` argument if given; else the next release line from the repo's release tooling (release-please manifest / CHANGELOG / pending commit types — `feat` → minor, `fix` → patch); else ask the user.
   3. Check the project's existing versions: `getJiraIssueTypeMetaWithFields` (with `requiredFieldsOnly: false`) — the `fixVersions` field's `allowedValues` lists every assignable version.
   4. If the target version **exists**, set it: `editJiraIssue` with `fields: { "fixVersions": [{ "name": "<version>" }] }`.
   5. If it **doesn't exist**: the Atlassian MCP has **no create-version tool** — `editJiraIssue` with an unknown name fails with `Version name '...' is not valid`. Do not silently skip. Give the user the direct Releases link (`https://<site>/projects/<KEY>?selectedItem=com.atlassian.jira.jira-projects-plugin:release-page`), ask them to create the version there (takes seconds), then **retry** step 7.4. If `acli` (Atlassian CLI) is installed and authenticated, `acli jira project version create` is an acceptable alternative — but never introduce API tokens for this.
   6. The branch-type prefix chosen in step 3 must match the commit type you'll use — that's what drives the release-please version bump; flag any inconsistency between the planned commit type and the fixVersion's release line.

8. **Reviewer(s) — resolve, then WRITE to the Jira ticket** (they are Jira reviewers, not just a note for the PR):
   1. **Resolve** in priority order: skill argument → reviewer field already on the ticket → ask the user (AskUserQuestion; "decide at PR time" is a valid answer for the *PR*, but still try to fill the Jira field).
   2. **Find the reviewer field** in the step-2 fetch: a custom multi-user-picker field named like "Reviewer(s)" / "Code Reviewer" (`expand: "names"` gives you the id↔name map; e.g. on GMW it's `customfield_10032` "Reviewers"). Custom field ids vary per project — discover, don't assume, outside of known projects.
   3. **Write it** if empty or if the argument differs from what's on the ticket: `lookupJiraAccountId` for each reviewer name/email, then `editJiraIssue` with `fields: { "<customfield_id>": [{ "accountId": "..." }] }`. If a name resolves to multiple accounts, show the candidates and ask.
   4. If the ticket already has the same reviewers, say so and skip the write.
   5. Also record the reviewers in the session so the later `gh pr create` / `gh pr edit --add-reviewer` reuses them (resolving to GitHub handles at that point) without re-asking.

9. **Recap**: one short summary — ticket moved to In Progress, branch name + pushed (dev-panel link), fixVersion set (or blocked on version creation), reviewers written to the ticket, and any versioning caveat.

## Notes

- Never commit repo-standards sync files (`.claude/`, `CLAUDE.md`, `skills-lock.json`).
- If the Atlassian MCP is not connected, stop and tell the user to run `/mcp` — do not silently skip the ticket transition or field writes.
- Ticket in a different project/site than expected: surface it, don't guess.
- No Jira API tokens, ever — all Jira writes go through the Atlassian MCP (OAuth). The only known gap is version creation (step 7.5).
