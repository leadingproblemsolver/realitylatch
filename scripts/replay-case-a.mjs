import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { mapStudioFields } from '../src/adapters/nutrient-studio-fields.mjs';
import { evaluateCase } from '../src/application/evaluate-case.mjs';

const types = ['invoice', 'shipping_document', 'certificate'];
const claims = [];
for (const documentType of types) {
  const path = `evidence/case-a/raw/${documentType}.fields.json`;
  const rawText = await readFile(path, 'utf8');
  const data = JSON.parse(rawText);
  const sha256 = createHash('sha256').update(rawText).digest('hex');
  claims.push(...mapStudioFields(documentType, data, { path, sha256 }));
}
const result = evaluateCase({ caseId: 'RL-CASE-A', claims }, { minConfidence: 0 });
const receipt = {
  caseId: 'RL-CASE-A',
  evidenceType: 'live-nutrient-studio-export-replay',
  hardFields: ['shipment_id','buyer_name','quantity'],
  claims,
  result,
  proves: [
    'the three preserved Nutrient Studio JSON exports can be replayed deterministically',
    'the approved hard fields reconcile for Case A',
    'the RealityLatch gate classifies this evidence bundle'
  ],
  doesNotProve: [
    'automated Nutrient API extraction is wired',
    'production reliability',
    'human review behavior',
    'a downstream shipment release occurred',
    'market adoption'
  ]
};
await mkdir('evidence/case-a/derived', { recursive: true });
await writeFile('evidence/case-a/derived/receipt.json', JSON.stringify(receipt, null, 2));
console.log(JSON.stringify(receipt, null, 2));
