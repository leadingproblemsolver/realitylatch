# Next Machine Gate

## Blocked on human input
Machine work resumes after the human completes:
1. `human/01_ACCEPTANCE_CONTRACT.md`
2. `human/02_INVARIANTS.md`

## Then AI should execute, without re-deciding those contracts
1. Convert the approved material field set into the Nutrient extraction schema.
2. Add one live DWS extraction runner using `NUTRIENT_API_KEY` from `.env`.
3. Persist the raw DWS response unchanged as source evidence.
4. Create a pure mapper from DWS output -> RealityLatch `Claim[]` with provenance/confidence.
5. Add a replay fixture captured from the real API response with secrets/PII removed.
6. Add contract tests proving the mapper preserves source grounding.
7. Only after that, create the DWS Viewer human-review path.

## Stop condition
Stop immediately if the live DWS response shape invalidates our assumed schema/provenance model. That is information gain, not a failure; revise the human-approved contract explicitly rather than silently adapting semantics in code.
