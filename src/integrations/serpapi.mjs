const ENDPOINT = 'https://serpapi.com/search';

export async function corroborateWithSearch({ query, location, apiKey = process.env.SERPAPI_API_KEY, fetchImpl = fetch }) {
  if (!apiKey) throw new Error('SERPAPI_API_KEY_REQUIRED');
  if (!query) throw new Error('SERPAPI_QUERY_REQUIRED');

  const url = new URL(ENDPOINT);
  url.searchParams.set('engine', 'google');
  url.searchParams.set('q', query);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('output', 'json');
  if (location) url.searchParams.set('location', location);

  const response = await fetchImpl(url);
  if (!response.ok) throw new Error(`SERPAPI_HTTP_FAILED:${response.status}`);
  const json = await response.json();
  if (json.error) throw new Error(`SERPAPI_SEARCH_FAILED:${json.error}`);

  return {
    searchId: json.search_metadata?.id ?? null,
    status: json.search_metadata?.status ?? null,
    organicResults: (json.organic_results ?? []).map(({ position, title, link, snippet }) => ({ position, title, link, snippet }))
  };
}
