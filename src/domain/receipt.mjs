import { createHash } from 'node:crypto';

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((k) => [k, stable(value[k])]));
  }
  return value;
}

export function issueReceipt(payload, now = new Date()) {
  const body = {
    version: 1,
    issuedAt: now.toISOString(),
    ...payload
  };
  const canonical = JSON.stringify(stable(body));
  return {
    ...body,
    receiptHash: createHash('sha256').update(canonical).digest('hex')
  };
}
