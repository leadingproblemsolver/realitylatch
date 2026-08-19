const HARD_FIELDS = ['shipment_id', 'buyer_name', 'quantity'];

export function mapStudioFields(documentType, data, source = {}) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new TypeError('Nutrient Studio fields output must be a JSON object');
  }

  return HARD_FIELDS.map((field) => ({
    documentType,
    field,
    value: data[field] ?? null,
    confidence: data.confidence?.[field] ?? null,
    source: {
      provider: 'nutrient',
      exportType: 'studio-fields-json',
      ...source
    }
  }));
}

export { HARD_FIELDS };
