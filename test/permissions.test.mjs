import test from 'node:test';
import assert from 'node:assert/strict';
import { authorizeAction } from '../src/domain/permissions.mjs';
import { RealityState } from '../src/domain/status.mjs';

test('release is denied from contradicted state', () => {
  assert.deepEqual(authorizeAction({ state: RealityState.CONTRADICTED, action: 'RELEASE_SHIPMENT' }), {
    authorized: false,
    reason: 'STATE_NOT_VERIFIED'
  });
});

test('verified state with unresolved failures still fails closed', () => {
  assert.equal(authorizeAction({ state: RealityState.VERIFIED, action: 'RELEASE_SHIPMENT', unresolvedMaterialFailures: 1 }).authorized, false);
});

test('verified state with no material failures permits release', () => {
  assert.equal(authorizeAction({ state: RealityState.VERIFIED, action: 'RELEASE_SHIPMENT', unresolvedMaterialFailures: 0 }).authorized, true);
});
