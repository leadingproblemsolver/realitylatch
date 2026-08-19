import test from 'node:test';
import assert from 'node:assert/strict';
import { corroborateWithSearch } from '../src/integrations/serpapi.mjs';
import { xanoRequest } from '../src/integrations/xano.mjs';

test('SerpApi adapter surfaces API-declared errors', async () => {
  const fakeFetch = async () => ({ ok: true, json: async () => ({ error: 'bad query' }) });
  await assert.rejects(() => corroborateWithSearch({ query: 'x', apiKey: 'test', fetchImpl: fakeFetch }), /SERPAPI_SEARCH_FAILED/);
});

test('Xano adapter distinguishes HTTP failure from success', async () => {
  const fakeFetch = async () => ({ ok: false, status: 500, text: async () => 'boom' });
  await assert.rejects(() => xanoRequest('/x', { baseUrl: 'https://example.test', fetchImpl: fakeFetch }), /XANO_REQUEST_FAILED:500/);
});
