import test from 'node:test';
import assert from 'node:assert/strict';
import { mapStudioFields } from '../src/adapters/nutrient-studio-fields.mjs';
import { evaluateCase } from '../src/application/evaluate-case.mjs';
import { RealityState } from '../src/domain/status.mjs';

test('exact Nutrient Studio fields shape maps to approved hard claims', () => {
  const raw = { document_type: 'COMMERCIAL INVOICE', shipment_id: 'SHP-2042', buyer_name: 'Acme Logistics LLC', quantity: '120' };
  const claims = mapStudioFields('invoice', raw, { file: 'invoice.fields.json' });
  assert.deepEqual(claims.map(x => x.field), ['shipment_id','buyer_name','quantity']);
  assert.deepEqual(claims.map(x => x.value), ['SHP-2042','Acme Logistics LLC','120']);
});

test('three exact Studio outputs form a VERIFIED Case A bundle', () => {
  const docs = ['invoice','shipping_document','certificate'];
  const claims = docs.flatMap(documentType => mapStudioFields(documentType, {shipment_id:'SHP-2042',buyer_name:'Acme Logistics LLC',quantity:'120'}));
  const result = evaluateCase({ caseId: 'RL-CASE-A', claims }, { minConfidence: 0 });
  assert.equal(result.state, RealityState.VERIFIED);
});
