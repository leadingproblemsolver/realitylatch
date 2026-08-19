# Continuation Contract for Claude Code / Coding Agent

You are implementing RealityLatch. Treat the files under `human/` as human-owned contracts, not suggestions.

## Non-negotiable delegation boundary
AI may aggressively implement boilerplate, SDK glue, adapters, persistence plumbing, repetitive tests, mocks, refactors, documentation drafts, and UI scaffolding.

AI MUST NOT silently choose or change:
- the problem/economic consequence
- material invariants
- legal state transitions
- failure/retry/UNKNOWN semantics
- human authority boundaries
- independent verification criteria
- claim boundaries

If implementation pressure exposes a missing decision in those categories, stop that path and write the smallest explicit question into `human/PENDING_DECISIONS.md`; continue only work that does not depend on it.

## Current machine objective
Follow `control/NEXT_MACHINE_GATE.md` after Human Gates 1–2 are completed.

## Proof discipline
Every change must end in at least one of:
- passing executable test
- captured/replayable external API evidence
- falsified assumption
- explicit blocked decision

Never label an API 200, function return, deployment, or generated output as verified consequence without an independent reread/postcondition.
