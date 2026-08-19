# HUMAN GATE 3 — Failure Semantics + Predictions

Before AI writes each hostile test, predict the result and reason.

| Scenario | Your predicted state/result | Why | Retry? | Fail closed? | Idempotency/compensation? |
|---|---|---|---|---|---|
| Missing certificate | | | | | |
| 120 vs 102 quantity | | | | | |
| Low-confidence extraction | | | | | |
| Nutrient timeout before response | | | | | |
| SerpApi timeout | | | | | |
| Xano write fails before action | | | | | |
| External action times out after request sent | | | | | |
| Crash after side effect but before persistence | | | | | |
| Reviewer double-submits | | | | | |
| Stale approval after evidence changes | | | | | |
| Action called before approval | | | | | |
| Action returns 200 but reread disagrees | | | | | |

Use the vocabulary deliberately:
`SUCCEEDED | FAILED | UNKNOWN | RETRYING | WAITING | AWAITING_APPROVAL | CANCELLED`
