function config(baseUrl = process.env.XANO_BASE_URL, token = process.env.XANO_AUTH_TOKEN) {
  if (!baseUrl) throw new Error('XANO_BASE_URL_REQUIRED');
  return { baseUrl: baseUrl.replace(/\/$/, ''), token };
}

export async function xanoRequest(path, { method = 'GET', body, baseUrl, token, fetchImpl = fetch } = {}) {
  const cfg = config(baseUrl, token);
  const headers = { 'content-type': 'application/json' };
  if (cfg.token) headers.authorization = `Bearer ${cfg.token}`;
  const response = await fetchImpl(`${cfg.baseUrl}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`XANO_REQUEST_FAILED:${response.status}:${text.slice(0, 300)}`);
  }
  return response.status === 204 ? null : response.json();
}

export function persistCase(caseState, opts = {}) {
  return xanoRequest('/realitylatch/cases', { method: 'POST', body: caseState, ...opts });
}

export function rereadCase(caseId, opts = {}) {
  return xanoRequest(`/realitylatch/cases/${encodeURIComponent(caseId)}`, opts);
}
