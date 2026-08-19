import test from 'node:test';
import assert from 'node:assert/strict';
import { issueReceipt } from '../src/domain/receipt.mjs';

test('receipt is deterministic for same timestamp and payload', () => {
  const now = new Date('2026-08-17T20:00:00.000Z');
  const a = issueReceipt({ caseId: 'RL-1', before: 'CONTRADICTED', after: 'VERIFIED' }, now);
  const b = issueReceipt({ after: 'VERIFIED', before: 'CONTRADICTED', caseId: 'RL-1' }, now);
  assert.equal(a.receiptHash, b.receiptHash);
});
