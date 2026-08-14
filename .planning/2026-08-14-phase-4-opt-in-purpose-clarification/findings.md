# Findings: Phase 4 opt-in purpose clarification

## Official platform facts rechecked on 2026-08-14

- OpenAI's sandbox documentation defines the sandbox as the technical boundary for local clients and the approval policy as the rule
  for when an agent must stop before crossing that boundary. Inside the configured boundary, routine work may proceed automatically.
- OpenAI's Cloud environment documentation says a Cloud task creates a container, checks out the selected branch/commit, runs setup
  and optional cached maintenance, then lets the agent edit/test and returns a diff. Agent-phase internet is off by default.
- Cloud container state can be cached for up to 12 hours. Official documentation does not promise that the agent always runs as root;
  observed writable paths are dated environment facts, not the Phase 4 product contract.

## Four switches that newcomers must not merge

| Layer | Authorizes | Does not authorize |
|---|---|---|
| Local sandbox/approval | A local Codex command crossing configured file/network/execution boundaries | PWF smart/autonomous behavior |
| Cloud task/environment permission | Work inside the remote task container/repository under environment policy | PWF profile activation or access to the user's unrelated local machine |
| System-managed Hook trust | Whether the platform accepts and runs the installed adapter | Which PWF profile an exact plan has opted into |
| Phase 4 PWF opt-in | Exact plan-local managed Hook selection of smart/autonomous context semantics | More OS/network/root power, a workspace writer, or account identity |

## Phase 4 purpose

Phase 4 is not a permission-escalation project. It establishes a fail-closed, reversible, profile-bound consent boundary for changing
planning context behavior while legacy remains the default. The maintainer/user prepares and reviews Git-backed state; the final
activation-only commit is the product opt-in. Managed runtime remains read-only and disarm removes only the commit point.

## Documentation shape

- ROADMAP should lead Phase 4 with one newcomer sentence, the four-switch table and a gate table whose second column says why each gate
  exists in plain language—not only which files it changes.
- Phase 4.1 must receive a clearly dated/post-implementation clarification rather than rewriting the original Discovery conclusion.
- Official Cloud/root/cache observations remain explanatory evidence, not stable product invariants. Stable Phase 4 invariants are
  legacy-by-default, explicit profile-bound activation, read-only managed runtime, fail-closed invalid state and reversible disarm.
