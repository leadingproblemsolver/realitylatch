import { RealityState } from './status.mjs';

export function authorizeAction({ state, action, unresolvedMaterialFailures = 0 }) {
  if (action !== 'RELEASE_SHIPMENT') {
    return { authorized: false, reason: 'UNKNOWN_ACTION' };
  }
  if (state !== RealityState.VERIFIED) {
    return { authorized: false, reason: 'STATE_NOT_VERIFIED' };
  }
  if (unresolvedMaterialFailures > 0) {
    return { authorized: false, reason: 'UNRESOLVED_MATERIAL_FAILURES' };
  }
  return { authorized: true, reason: 'POLICY_SATISFIED' };
}
