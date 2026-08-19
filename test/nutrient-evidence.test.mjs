import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  mapNutrientKeyValueEvidence,
  normalizeConfidence
} from '../src/integrations/nutrient.mjs';

test('Nutrient mapper preserves provenance, provider labels, values, and confidence', async () => {
  const raw = JSON.parse(await readFile('evidence/nutrient/replay/official-kvp-shape.json', 'utf8'));
  const evidence = mapNutrientKeyValueEvidence(raw, {
    documentId: 'invoice.pdf',
    documentType: 'invoice'
  });

  assert.equal(evidence.length, 2);
  assert.deepEqual(evidence[0], {
    source: 'nutrient_dws',
    document_id: 'invoice.pdf',
    document_type: 'invoice',
    provider_label: 'Shipment ID',
    provider_value: 'SHP-2042',
    confidence: 0.954,
    provenance: {
      page_index: 0,
      key_bbox: { left: 10, top: 20, width: 100, height: 18 },
      value_bbox: { left: 120, top: 20, width: 100, height: 18 },
      data_type: 'String'
    }
  });
});

test('confidence normalization handles provider 0-100 and 0-1 forms', () => {
  assert.equal(normalizeConfidence(95.4), 0.954);
  assert.equal(normalizeConfidence(0.73), 0.73);
  assert.equal(normalizeConfidence(null), null);
});
