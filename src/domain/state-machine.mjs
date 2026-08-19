import { RealityState } from './status.mjs';

const legal = new Map([
  [RealityState.EVIDENCE_READY, new Set([RealityState.VERIFIED, RealityState.CONTRADICTED, RealityState.INSUFFICIENT_EVIDENCE])],
  [RealityState.CONTRADICTED, new Set([RealityState.HUMAN_REVIEW_REQUIRED])],
  [RealityState.INSUFFICIENT_EVIDENCE, new Set([RealityState.HUMAN_REVIEW_REQUIRED])],
  [RealityState.HUMAN_REVIEW_REQUIRED, new Set([RealityState.APPROVED, RealityState.REJECTED])],
  [RealityState.APPROVED, new Set([RealityState.VERIFIED])],
  [RealityState.VERIFIED, new Set([RealityState.ACTION_AUTHORIZED])],
  [RealityState.ACTION_AUTHORIZED, new Set([RealityState.ACTION_EXECUTED])],
  [RealityState.ACTION_EXECUTED, new Set([RealityState.VERIFIED, RealityState.EXECUTION_DIVERGED])],
  [RealityState.EXECUTION_DIVERGED, new Set([RealityState.HUMAN_REVIEW_REQUIRED])],
  [RealityState.REJECTED, new Set([RealityState.RECEIPT_ISSUED])],
  [RealityState.VERIFIED, new Set([RealityState.ACTION_AUTHORIZED, RealityState.RECEIPT_ISSUED])]
]);

export function assertTransition(from, to) {
  const allowed = legal.get(from);
  if (!allowed?.has(to)) {
    throw new Error(`ILLEGAL_STATE_TRANSITION:${from}->${to}`);
  }
  return { from, to };
}
