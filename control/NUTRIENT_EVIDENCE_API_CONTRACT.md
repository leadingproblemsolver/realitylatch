# Nutrient Evidence API Contract — machine-owned plumbing

## Endpoint
`POST /api/evidence/extract`

## Input
- PDF/document binary
- declared document type / extraction preset
- case ID

## Provider action
Call Nutrient using the configured extraction schema/preset.

## Persist before transformation
- raw provider response
- provider request/correlation metadata
- timestamp
- document hash / local evidence ID

## Normalize into
```json
{
  "document_id": "doc_...",
  "case_id": "case_...",
  "document_type": "COMMERCIAL_INVOICE",
  "provider": "nutrient",
  "claims": {},
  "provenance": {},
  "raw_response_ref": "..."
}
```

## Hard boundary
This API MUST NOT:
- declare canonical shipment truth;
- resolve contradictions;
- authorize downstream action;
- replace null fields with inferred values;
- decide materiality beyond user-approved policy.

Those remain human-owned / policy-owned layers.
