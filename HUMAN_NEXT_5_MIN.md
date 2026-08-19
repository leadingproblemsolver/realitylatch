# Your next 5 minutes

This is the only human-owned action blocking the next machine gate.

- [ ] Create/open the Nutrient DWS dashboard account for the hackathon.
- [ ] Copy the API key into your local `.env` as `NUTRIENT_API_KEY=...` — never commit/paste it into chat.
- [ ] Put one non-sensitive trade-document PDF in `fixtures/live/` (invoice first is enough).
- [ ] Run: `npm run nutrient:extract -- fixtures/live/<invoice.pdf> invoice`
- [ ] Confirm a JSON file appears under `evidence/nutrient/raw-responses/`.
- [ ] Preserve that raw JSON unchanged.

Then provide ONLY the redacted raw-response JSON (remove PII/secrets if present), or run the continuation prompt locally with Claude Code.

Human ownership checkpoint before continuing:
Explain in one sentence why "Nutrient extracted a value" does not yet mean "RealityLatch may act on it."
