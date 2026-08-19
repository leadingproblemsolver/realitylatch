import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateCase } from '../src/application/evaluate-case.mjs';
import { RealityState } from '../src/domain/status.mjs';

function claims(overrides = {}) {
  const docs = ['invoice', 'shipping_document', 'certificate'];
  const baseline = {
    shipment_id: 'SHP-2042',
    buyer_name: 'Acme Logistics LLC',
    quantity: 120,
    ...overrides
  };
  return docs.flatMap((documentType) =>
    Object.entries(baseline).map(([field, value]) => ({
      documentType,
      field,
      value,
      confidence: 0.99,
      source: `${documentType}:${field}`
    }))
  );
}

test('approved 3-field gate verifies when all required docs agree', () => {
  const result = evaluateCase({ caseId: 'agree', claims: claims() });
  assert.equal(result.state, RealityState.VERIFIED);
  assert.equal(result.canonical.shipment_id, 'SHP-2042');
  assert.equal(result.canonical.buyer_name, 'Acme Logistics LLC');
  assert.equal(result.canonical.quantity, 120);
});

test('buyer-name mismatch blocks action', () => {
  const c = claims();
  c.find((x) => x.documentType === 'certificate' && x.field === 'buyer_name').value =
    'Different Buyer LLC';

  const result = evaluateCase({ caseId: 'buyer-mismatch', claims: c });
  assert.equal(result.state, RealityState.CONTRADICTED);
  assert.equal(result.canonical.buyer_name, null);
  assert.deepEqual(result.blockedActions, ['RELEASE_SHIPMENT']);
  assert.ok(result.failures.some((f) => f.invariant === 'BUYER_NAME_CONSISTENCY'));
});

test('missing quantity in one required document is insufficient evidence', () => {
  const c = claims().filter(
    (x) => !(x.documentType === 'certificate' && x.field === 'quantity')
  );
  const result = evaluateCase({ caseId: 'missing-quantity', claims: c });
  assert.equal(result.state, RealityState.INSUFFICIENT_EVIDENCE);
  assert.ok(result.failures.some((f) => f.invariant === 'QUANTITY_PRESENT'));
});

test('cosmetic case/whitespace differences do not create contradiction', () => {
  const c = claims();
  c.find((x) => x.documentType === 'shipping_document' && x.field === 'buyer_name').value =
    '  ACME   LOGISTICS LLC ';
  const result = evaluateCase({ caseId: 'cosmetic', claims: c });
  assert.equal(result.state, RealityState.VERIFIED);
});
