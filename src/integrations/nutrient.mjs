import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { basename, dirname } from 'node:path';

export const NUTRIENT_BUILD_URL = 'https://api.nutrient.io/build';

/**
 * Proven Nutrient DWS integration surface.
 * Uses the documented /build + json-content + keyValuePairs contract.
 * Raw provider output is returned unchanged; canonical semantics are decided elsewhere.
 */
export async function extractWithNutrient({
  filePath,
  apiKey = process.env.NUTRIENT_API_KEY,
  fetchImpl = fetch,
  timeoutMs = 30_000
}) {
  if (!apiKey) throw new Error('NUTRIENT_API_KEY_REQUIRED');
  if (!filePath) throw new Error('FILE_PATH_REQUIRED');

  const bytes = await readFile(filePath);
  const form = new FormData();
  const fileName = basename(filePath);
  form.append(fileName, new Blob([bytes], { type: 'application/pdf' }), fileName);
  form.append('instructions', JSON.stringify({
    parts: [{ file: fileName }],
    output: {
      type: 'json-content',
      plainText: true,
      structuredText: true,
      keyValuePairs: true,
      tables: true,
      language: 'english'
    }
  }));

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(NUTRIENT_BUILD_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
      signal: controller.signal
    });

    const bodyText = await response.text();
    if (!response.ok) {
      throw new Error(`NUTRIENT_BUILD_FAILED:${response.status}:${bodyText.slice(0, 500)}`);
    }

    try {
      return JSON.parse(bodyText);
    } catch {
      throw new Error('NUTRIENT_BUILD_NON_JSON_RESPONSE');
    }
  } catch (error) {
    if (error?.name === 'AbortError') throw new Error('NUTRIENT_BUILD_TIMEOUT_UNKNOWN');
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

export async function persistRawNutrientEvidence(raw, outputPath) {
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(raw, null, 2));
  return outputPath;
}

/**
 * Pure provider -> evidence mapper. It does NOT decide canonical truth.
 * It preserves the exact KVP label/value, page index, confidence, and bounding boxes.
 */
export function mapNutrientKeyValueEvidence(raw, { documentId, documentType }) {
  const claims = [];
  const pages = Array.isArray(raw?.pages) ? raw.pages : [];

  for (const page of pages) {
    const pageIndex = Number.isInteger(page?.pageIndex) ? page.pageIndex : null;
    for (const pair of Array.isArray(page?.keyValuePairs) ? page.keyValuePairs : []) {
      const label = pair?.key?.content ?? null;
      const value = pair?.value?.content ?? null;
      if (label == null || value == null) continue;

      claims.push({
        source: 'nutrient_dws',
        document_id: documentId,
        document_type: documentType,
        provider_label: label,
        provider_value: value,
        confidence: normalizeConfidence(pair?.confidence),
        provenance: {
          page_index: pageIndex,
          key_bbox: pair?.key?.bbox ?? null,
          value_bbox: pair?.value?.bbox ?? null,
          data_type: pair?.value?.dataType ?? null
        }
      });
    }
  }

  return claims;
}

export function normalizeConfidence(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return null;
  if (value > 1) return Math.round(Math.max(0, Math.min(1, value / 100)) * 1_000_000) / 1_000_000;
  return Math.max(0, Math.min(1, value));
}
