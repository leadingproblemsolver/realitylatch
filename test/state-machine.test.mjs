import test from 'node:test';
import assert from 'node:assert/strict';
import { assertTransition } from '../src/domain/state-machine.mjs';
import { RealityState as S } from '../src/domain/status.mjs';

test('contradiction must pass through human review before approval', () => {
  assert.deepEqual(assertTransition(S.CONTRADICTED, S.HUMAN_REVIEW_REQUIRED), { from: S.CONTRADICTED, to: S.HUMAN_REVIEW_REQUIRED });
  assert.throws(() => assertTransition(S.CONTRADICTED, S.VERIFIED), /ILLEGAL_STATE_TRANSITION/);
});

test('action cannot jump directly from verified to executed', () => {
  assert.throws(() => assertTransition(S.VERIFIED, S.ACTION_EXECUTED), /ILLEGAL_STATE_TRANSITION/);
});
