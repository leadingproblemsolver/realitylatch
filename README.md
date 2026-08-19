# RealityLatch

**A control plane between what evidence claims and what operations are allowed to do.**

RealityLatch is a narrow externalization of Logistinfra's Reality Handoff layer: extracted document facts are treated as evidence, reconciled against explicit human-approved invariants, and only then admitted into permission state.

## Current public proof state — v0.2

The repository contains a runnable deterministic kernel, a small HTTP surface, integration adapters, controlled failure fixtures, and a preserved three-document Nutrient Studio evidence replay.

Fresh verification against the v0.2 package on **2026-08-19**:

- `npm test` → **19/19 tests passed**;
- `npm run proof:case-a` → three preserved Nutrient Studio field exports replayed into **9 provenance-bearing claims**;
- approved hard fields `shipment_id`, `buyer_name`, and `quantity` reconciled to `SHP-2042`, `Acme Logistics LLC`, and `120`;
- Case A classified **VERIFIED**;
- controlled mismatch classified **CONTRADICTED** and blocked release;
- controlled missing-evidence case classified **INSUFFICIENT_EVIDENCE** and blocked release.

## Run

Requires Node 20+ and no package installation for the current kernel.

```bash
node --version
npm test
npm run proof:case-a
node scripts/demo-local.mjs
```

The HTTP proof surface can also be started with:

```bash
npm start
```

## Evidence flow

```text
provider/document evidence
  → provenance-preserving claim mapping
  → cosmetic-only normalization
  → human-approved cross-document invariants
  → VERIFIED | CONTRADICTED | INSUFFICIENT_EVIDENCE
  → permission gate
  → bounded human resolution / later action
  → durable receipt
```

## Exact public receipt

The strongest current receipt is committed at:

- [`evidence/case-a/derived/receipt.json`](evidence/case-a/derived/receipt.json)
- raw preserved Studio exports under [`evidence/case-a/raw/`](evidence/case-a/raw/)
- the cross-document gate in [`control/CROSS_DOCUMENT_GATE.md`](control/CROSS_DOCUMENT_GATE.md)

The receipt preserves provider identity, export type, source file path and SHA-256 for each admitted claim.

## Human-owned hard fields

The current reconciliation contract intentionally admits only three hard cross-document fields:

- `shipment_id`
- `buyer_name`
- `quantity`

Missing required evidence fails to `INSUFFICIENT_EVIDENCE`. A material contradiction in any approved hard field fails to `CONTRADICTED`. Cosmetic normalization may remove case/whitespace/Unicode differences only; the system does not fuzzy-match companies, repair IDs, infer aliases, or silently convert units.

## Sponsor / integration boundary

- **Nutrient DWS / Studio** — grounded document extraction and source evidence.
- **RealityLatch kernel** — truth admission, materiality, reconciliation, state and permission gates.
- **Xano** — adapter for durable workflow state once the external execution contract is approved.
- **SerpApi** — bounded corroboration adapter only when a human resolution path needs external evidence.

## What this proves

- deterministic reconciliation over preserved provider outputs;
- provenance-preserving mapping from provider fields into canonical claims;
- fail-closed contradiction and missing-evidence behavior;
- explicit separation of evidence state from action permission;
- human authority remains necessary to resolve contradiction before consequential execution.

## What this does **not** prove

- automated Nutrient API extraction is wired end-to-end in production;
- production reliability or scale;
- human reviewers resolve contradictions correctly;
- any real shipment was released or blocked;
- customer adoption, operational savings, compliance outcome, or revenue.

## Security

Never commit secrets. Copy `.env.example` to `.env` locally. Provider credentials belong only in the runtime environment.

## Human ownership

The files under [`human/`](human/) preserve the acceptance contract, invariants, failure predictions, authority model, execution-path reconstruction, modification test and settlement record. The code path is deliberately unable to silently choose those contracts on the operator's behalf.

## Next external evidence event

Wire one live Nutrient API extraction through the same claim adapter, preserve the raw provider response and citations, then run the exact same reconciliation/permission path. Only after that should the proof state be upgraded beyond deterministic replay of preserved provider exports.
