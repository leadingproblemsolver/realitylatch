# HUMAN GATE 1 — Acceptance Contract

## User-owned decisions — current

### Protected consequence
RealityLatch acts as a control plane between logistics operational decisions and evidence claims, with AI systems operating inside explicit human gates.

### v1 document contribution contract
A commercial invoice may contribute toward VERIFIED only when the mission-relevant proof fields required by policy are present and usable.

Current user-selected required fields:
- `destination`
- `buyer_name`
- `total_amount`
- `issue_date`

### Null semantics
User decision:
- Missing fields should be classified, not treated uniformly.
- Some fields are so basic that simple absence should produce `INSUFFICIENT_EVIDENCE` rather than wasting human review.
- Missing/ambiguous fields that are required to verify a material invariant (example: `buyer_name`) may require `HUMAN_REVIEW_REQUIRED` when a human can realistically resolve the uncertainty through operational context / human-human confirmation.

### Fail-closed principle
No consequential downstream action should be authorized merely because an extraction model returned a plausible value.

### Observable v1 output
For every ingested document:
- provider raw response is preserved;
- normalized claims are emitted;
- provenance/citations are retained where available;
- required-field completeness is classified;
- no canonical truth is silently inferred from missing/contradictory evidence.

### External specification / build admission
- [x] External judge/spec requires meaningful Nutrient integration.
- [x] Current live extraction exposed a real evidence-quality boundary: the sample invoice is structurally valid but mostly blank.
- [x] Verification exposed the need to distinguish extraction success from evidence sufficiency.

## Still personally owned / unresolved
- Exact required field set for each document type.
- Exact rule deciding `INSUFFICIENT_EVIDENCE` vs `HUMAN_REVIEW_REQUIRED`.
- Exact action(s) gated by VERIFIED.
- Independent verification method for the first real logistics consequence.
