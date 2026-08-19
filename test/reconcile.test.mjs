import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { evaluateCase } from '../src/application/evaluate-case.mjs';
import { RealityState } from '../src/domain/status.mjs';

async function fixture(name) {
  return JSON.parse(await readFile(new URL(`../fixtures/${name}.json`, import.meta.url), 'utf8'));
}

test('happy path becomes VERIFIED and permits release', async () => {
  const result = evaluateCase(await fixture('happy'));
  assert.equal(result.state, RealityState.VERIFIED);
  assert.equal(result.canonical.quantity, 120);
  assert.deepEqual(result.permittedActions, ['RELEASE_SHIPMENT']);
});

test('material mismatch becomes CONTRADICTED and fails closed', async () => {
  const result = evaluateCase(await fixture('mismatch'));
  assert.equal(result.state, RealityState.CONTRADICTED);
  assert.equal(result.canonical.quantity, null);
  assert.deepEqual(result.blockedActions, ['RELEASE_SHIPMENT']);
  assert.ok(result.failures.some((f) => f.invariant === 'QUANTITY_CONSISTENCY'));
});

test('missing/low-confidence evidence becomes INSUFFICIENT_EVIDENCE', async () => {
  const result = evaluateCase(await fixture('missing'));
  assert.equal(result.state, RealityState.INSUFFICIENT_EVIDENCE);
  assert.deepEqual(result.blockedActions, ['RELEASE_SHIPMENT']);
  assert.ok(result.failures.some((f) => f.invariant === 'REQUIRED_DOCUMENTS_COMPLETE'));
});
