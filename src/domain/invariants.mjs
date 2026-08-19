const requiredDocsDefault = ['invoice', 'shipping_document', 'certificate'];
const crossDocumentFieldsDefault = ['shipment_id', 'buyer_name', 'quantity'];

function valuesFor(claims, field) {
  return claims.filter(
    (c) => c.field === field && c.value !== null && c.value !== undefined && c.value !== ''
  );
}

export function comparableValue(value) {
  if (typeof value === 'string') {
    return value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase();
  }
  return value;
}

function distinctComparable(values) {
  const seen = new Map();
  for (const original of values) {
    const comparable = comparableValue(original);
    const key = JSON.stringify(comparable);
    if (!seen.has(key)) seen.set(key, original);
  }
  return [...seen.values()];
}

export function evaluateInvariants(claims, options = {}) {
  const requiredDocs = options.requiredDocs ?? requiredDocsDefault;
  const crossDocumentFields = options.crossDocumentFields ?? crossDocumentFieldsDefault;
  const minConfidence = options.minConfidence ?? 0.9;
  const presentDocs = new Set(claims.map((c) => c.documentType));
  const failures = [];

  const missingDocs = requiredDocs.filter((d) => !presentDocs.has(d));
  if (missingDocs.length) {
    failures.push({
      invariant: 'REQUIRED_DOCUMENTS_COMPLETE',
      severity: 'MATERIAL',
      details: { missingDocs }
    });
  }

  for (const field of crossDocumentFields) {
    const fieldClaims = valuesFor(claims, field);
    const docsWithField = new Set(fieldClaims.map((c) => c.documentType));
    const missingFieldDocs = requiredDocs.filter((d) => !docsWithField.has(d));

    if (missingFieldDocs.length) {
      failures.push({
        invariant: `${field.toUpperCase()}_PRESENT`,
        severity: 'MATERIAL',
        details: { field, missingFieldDocs }
      });
      continue;
    }

    const lowConfidence = fieldClaims.filter((c) => Number(c.confidence ?? 0) < minConfidence);
    if (lowConfidence.length) {
      failures.push({
        invariant: `${field.toUpperCase()}_CONFIDENCE`,
        severity: 'MATERIAL',
        details: { minConfidence, sources: lowConfidence.map((c) => c.source) }
      });
    }

    const uniqueValues = distinctComparable(fieldClaims.map((c) => c.value));
    if (uniqueValues.length > 1) {
      failures.push({
        invariant: `${field.toUpperCase()}_CONSISTENCY`,
        severity: 'MATERIAL',
        details: {
          field,
          originalValues: uniqueValues,
          comparableValues: uniqueValues.map(comparableValue)
        }
      });
    }
  }

  return failures;
}

export const REQUIRED_DOCUMENTS = requiredDocsDefault;
export const CROSS_DOCUMENT_FIELDS = crossDocumentFieldsDefault;
