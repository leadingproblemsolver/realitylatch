# Xano Durable-State Contract — NOT YET APPROVED

Xano should not be used as a generic persistence dump. It should own durable workflow state only after the human state/invariant/failure contracts are approved.

## Proposed durable tables
- cases
- documents
- claims
- gate_results
- reviews
- permissions
- actions
- verification_events
- receipts

## Proposed rule
Events/evidence are canonical. Current case state is a projection/reconstruction from durable events plus explicit human decisions.

## Before creating tables
Complete:
- `human/01_ACCEPTANCE_CONTRACT.md`
- `human/02_INVARIANTS.md`
- `human/03_FAILURE_PREDICTIONS.md`
- `human/04_AUTHORITY_MODEL.md`
