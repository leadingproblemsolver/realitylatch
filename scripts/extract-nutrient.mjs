import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';
import {
  extractWithNutrient,
  mapNutrientKeyValueEvidence,
  persistRawNutrientEvidence
} from '../src/integrations/nutrient.mjs';

const [filePath, documentType = 'unknown'] = process.argv.slice(2);
if (!filePath) {
  console.error('usage: node scripts/extract-nutrient.mjs <document.pdf> [document_type]');
  process.exit(2);
}

const raw = await extractWithNutrient({ filePath });
const safeName = basename(filePath).replace(/[^a-zA-Z0-9._-]/g, '_');
const rawPath = `evidence/nutrient/raw-responses/${Date.now()}-${safeName}.json`;
await persistRawNutrientEvidence(raw, rawPath);

const evidence = mapNutrientKeyValueEvidence(raw, {
  documentId: safeName,
  documentType
});

console.log(JSON.stringify({ rawPath, evidence }, null, 2));
