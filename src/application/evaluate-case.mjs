import { reconcileClaims } from '../domain/reconcile.mjs';

export function evaluateCase(caseData, options = {}) {
  if (!caseData?.caseId) throw new Error('CASE_ID_REQUIRED');
  if (!Array.isArray(caseData.claims)) throw new Error('CLAIMS_REQUIRED');
  return { caseId: caseData.caseId, ...reconcileClaims(caseData.claims, options) };
}
