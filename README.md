# RealityLatch

**A control plane between what evidence claims and what operations are allowed to do.**

RealityLatch is a narrow externalization of Logistinfra's Reality Handoff layer, supported by Reality Ontology, SpecGate/Constraint Intelligence, deterministic execution, independent verification, and durable receipts.

## v0 status
This repository intentionally contains a runnable deterministic kernel and integration adapters, while blocking live consequential execution behind human-owned contracts.

### Run
```bash
node --version  # >=20
npm test
npm run demo
```

No npm install is required for v0.

## Current flow
```text
fixture/document claims
  -> canonicalization
  -> explicit invariants
  -> VERIFIED | CONTRADICTED | INSUFFICIENT_EVIDENCE
  -> permission gate
  -> (later) human review / bounded action / reread / receipt
```

## Sponsor ownership
- Nutrient DWS: grounded document extraction + later human source review.
- RealityLatch kernel: truth admission, materiality, gates, authority, permissions.
- Xano: durable workflow state and rereads after the human contract is approved.
- SerpApi: bounded live corroboration only when it materially helps a human resolve uncertainty.

## Security
Never commit secrets. Copy `.env.example` to `.env` locally. Event/login credentials are not assumed to be API keys.

## Human gates
Start at `human/00_YOUR_TURN.md`. The repo is deliberately designed so AI code production cannot silently choose the problem contract, invariants, failure semantics, authority model, or claim boundary.

## Evidence cases included
- `fixtures/happy.json`: three documents agree -> `VERIFIED`.
- `fixtures/mismatch.json`: `120` vs `102` -> `CONTRADICTED`, action blocked.
- `fixtures/missing.json`: absent certificate + low confidence -> `INSUFFICIENT_EVIDENCE`, action blocked.

## Next machine step after Human Gates 1–2
Wire one real Nutrient extraction call for one PDF against the human-approved schema, persist the raw response as evidence, map it to RealityLatch claims without treating extraction as canonical truth, then add a replayable contract test.
