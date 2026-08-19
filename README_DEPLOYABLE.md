# RealityLatch — Deployable v0.2

## Current proof
Case A contains three real Nutrient Studio/dashboard `.fields.json` outputs (invoice, shipping document, certificate), preserved verbatim under `evidence/case-a/raw/`.

Run:
```bash
npm test
npm run proof:case-a
```

The replay produces `evidence/case-a/derived/receipt.json`.

## Human-owned invariants
Hard cross-document reconciliation fields:
- `shipment_id`
- `buyer_name`
- `quantity`

See:
- `human/02_INVARIANTS.md`
- `control/CROSS_DOCUMENT_GATE.md`

## Deploy
```bash
docker build -t realitylatch .
docker run --rm -p 8080:8080 realitylatch
```
Open `http://localhost:8080`.

For hosted deployment and secret configuration, see `DEPLOY_CLOUD_RUN.md`.

## Nutrient integration
The backend supports the documented DWS Processor `/build` surface for raw key-value extraction via `POST /api/nutrient/build-kvp`.

The API key is server-side only via `NUTRIENT_API_KEY`.

The schema-specific Studio `/extract` contract is intentionally not guessed in this build. Bind it only from the exact current Nutrient API contract, then add it as a separate adapter and regression-test it against the already-preserved Studio outputs.

## Studio export confidence boundary

The three supplied `.fields.json` exports do not contain per-field confidence or citations. Replay therefore sets the confidence threshold to 0 **only for these preserved Studio exports**. This proves exact-value reconciliation, not confidence-based evidence sufficiency. Live API extraction must restore confidence/provenance gating before any operational authorization.
