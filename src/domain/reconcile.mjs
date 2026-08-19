import { evaluateInvariants, CROSS_DOCUMENT_FIELDS, comparableValue } from './invariants.mjs';
import { RealityState } from './status.mjs';

export function reconcileClaims(claims, options = {}) {
  const failures = evaluateInvariants(claims, options);
  const hasMissing = failures.some((f) =>
    f.invariant.endsWith('_PRESENT') ||
    f.invariant === 'REQUIRED_DOCUMENTS_COMPLETE' ||
    f.invariant.endsWith('_CONFIDENCE')
  );
  const hasContradiction = failures.some((f) => f.invariant.endsWith('_CONSISTENCY'));

  let state = RealityState.VERIFIED;
  if (hasContradiction) state = RealityState.CONTRADICTED;
  else if (hasMissing) state = RealityState.INSUFFICIENT_EVIDENCE;

  const canonical = {};
  const fields = options.crossDocumentFields ?? CROSS_DOCUMENT_FIELDS;

  for (const field of fields) {
    const relevant = claims.filter(
      (c) => c.field === field && c.value !== null && c.value !== undefined && c.value !== ''
    );
    const byComparable = new Map();
    for (const claim of relevant) {
      const key = JSON.stringify(comparableValue(claim.value));
      if (!byComparable.has(key)) byComparable.set(key, claim.value);
    }
    const hasFailure = failures.some((f) => f.invariant.startsWith(field.toUpperCase()));
    canonical[field] = byComparable.size === 1 && !hasFailure
      ? [...byComparable.values()][0]
      : null;
  }

  return {
    state,
    canonical,
    failures,
    claims,
    permittedActions: state === RealityState.VERIFIED ? ['RELEASE_SHIPMENT'] : [],
    blockedActions: state === RealityState.VERIFIED ? [] : ['RELEASE_SHIPMENT']
  };
}
