# External Specification — DevNetwork API + Cloud + AI Hackathon 2026

This file converts the sponsor/judge requirements into build gates. The challenge, not internal completeness, is the external specification.

## Primary sponsor target: Nutrient DWS
Required by challenge:
- Nutrient DWS must perform at least one core document operation meaningfully.
- Submission needs project name + one-line pitch.
- Public/shared repository with setup instructions.
- 2–4 minute end-to-end demo.
- One line explaining where DWS does the heavy lifting and why.

Desired technical shape explicitly encouraged by sponsor:
- deterministic/auditable document output
- confidence-aware extraction
- human review where guesses are unacceptable
- replayable/auditable trail
- trade-document cross-checking is an explicitly suggested scenario

## Additional coherent sponsor surfaces
### Xano
Admit only if Xano is functionally responsible for durable backend state/business logic/workflows—not as a generic database decoration.

### SerpApi
Admit only if live structured search changes what evidence a reviewer can inspect for a genuine uncertainty. Search results remain signals, not canonical truth.

## Judge-facing acceptance
- Integration depth: sponsor APIs are functionally central.
- Technical execution: architecture and edge cases are visible in behavior/tests.
- Originality/impact: the value is preventing uncertain evidence from silently authorizing consequential action.
- Demo clarity: judge can see evidence -> failed gate -> human handoff -> permitted action -> verification -> receipt.

## Anti-goals
- No API-count maximization.
- No generic chat UI.
- No autonomous agent allowed to declare canonical truth.
- No sponsor integration without a causal role in the workflow.
