# RealityLatch Build State — 2026-08-18

## What is now true
- Core RealityLatch state/invariant/permission/receipt logic passes.
- Nutrient DWS transport uses the documented `POST https://api.nutrient.io/build` surface.
- Extraction requests ask for `json-content`, plain/structured text, key-value pairs, tables, and English OCR.
- Provider output is returned unchanged and can be persisted as raw evidence.
- Nutrient key-value pairs can be mapped into provider evidence while preserving:
  - label
  - value
  - confidence
  - page index
  - key bounding box
  - value bounding box
  - provider data type
- Provider evidence is NOT yet canonical RealityLatch truth.
- Tests: 13/13 passing.
- Local happy/mismatch/missing demo still passes expected gates.

## Current external blocker
We do not yet possess, in this runtime:
1. a valid `NUTRIENT_API_KEY`, and
2. the three actual trade-document PDF fixtures to submit.

Therefore we have NOT claimed a live Nutrient response.

## Next irreversible transition
Run one real document through Nutrient and preserve the raw response in:
`evidence/nutrient/raw-responses/`.

Then compare the real response to our replay contract before mapping fields such as
`shipment_id` or `quantity` into the RealityLatch canonical claim model.

## Do not do yet
- Do not add DWS Viewer semantics before confirming the live extraction shape.
- Do not let fuzzy label matching silently create canonical facts.
- Do not add SerpApi/Xano feature work ahead of the first live Nutrient receipt.
