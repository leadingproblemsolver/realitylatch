# Cross-Document Gate — Human-Owned Policy

## Approved hard reconciliation fields
1. `shipment_id`
2. `buyer_name` / consignee identity
3. `quantity`

Required documents:
- invoice
- shipping document
- certificate

## Classification
- missing required document/field or low confidence → `INSUFFICIENT_EVIDENCE`
- materially different values → `CONTRADICTED`
- all required evidence present and these 3 fields reconcile → candidate `VERIFIED`

`VERIFIED` still does not equal action authorization.

## Machine normalization allowed
Only representational cleanup:
- Unicode NFKC
- trim whitespace
- collapse repeated whitespace
- case-insensitive comparison

Original provider values stay preserved.

## Not authorized yet
No fuzzy matching, alias merging, subsidiary inference, unit conversion,
shipment-ID repair, or LLM semantic equivalence.
