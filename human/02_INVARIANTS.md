# HUMAN GATE 2 — State Model + Invariants

## User-owned decisions — current

### Approved core invariants
- Raw AI/provider extraction is evidence, not canonical truth.
- Missing required evidence must fail closed.
- Material contradictions must fail closed.
- Human review is appropriate where material evidence is ambiguous and human operational context can genuinely resolve it.
- Human review should not be used merely to compensate for obviously absent/basic evidence.
- Consequential operations remain gated by explicit authority and evidence.

### Current required invoice fields
User-selected:
- `destination`
- `buyer_name`
- `total_amount`
- `issue_date`

These are provisional v1 policy fields and remain subject to live-document testing.

### Null classification policy
Provisional user rule:

`MISSING_BASIC_REQUIRED_FIELD`
→ `INSUFFICIENT_EVIDENCE`

`AMBIGUOUS_OR_DISPUTED_MATERIAL_FIELD` where a human can resolve the uncertainty
→ `HUMAN_REVIEW_REQUIRED`

The implementation must not automatically convert either state to VERIFIED.

### Current user-selected material mismatch candidates
- `shipment_id`
- `invoice_number`
- `issue_date`

## IMPORTANT OPEN ASSUMPTION — do not silently encode as truth

`invoice_number` and `issue_date` are NOT yet approved as universal cross-document equality invariants.

Reason:
- a shipping document and a certificate may legitimately use identifiers different from the commercial invoice;
- each document may legitimately have its own issue date.

Before encoding these as hard mismatch gates, the user must verify the real domain relationship.

### Stronger candidate cross-document invariants to evaluate next
These are suggestions only, not yet user-approved:
- `shipment_id` / transport reference where shared
- `buyer_name` vs consignee / receiving party identity
- `quantity`
- goods/product identity
- origin/destination where the document types are expected to agree

## State-transition invariants already locked
- `VERIFIED != ACTION_AUTHORIZED`
- `ACTION_AUTHORIZED != EXECUTED`
- `EXECUTED != EXECUTION_VERIFIED`
- Provider confidence does not grant authority.
- Unknown external outcome must not be silently classified as success or failure.
- External corroboration may inform review but cannot silently overwrite documentary evidence.
- Every canonical transition must be reconstructable from evidence.

## Next human decision
Choose the smallest 3 cross-document fields that are genuinely expected to describe the SAME real-world fact across:
1. invoice,
2. shipping document,
3. certificate.

Do not choose fields merely because all documents contain a similarly named field.


## APPROVED CROSS-DOCUMENT HARD GATE — USER DECISION

The user selected:
- `shipment_id`
- `buyer_name`
- `quantity`

These are now the v1 hard reconciliation fields across invoice,
shipping document, and certificate.
