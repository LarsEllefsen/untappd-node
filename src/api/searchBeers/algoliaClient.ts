import HTTPException from '../../common/HTTPException';
import { AlgoliaBeerHit, AlgoliaSearchConfig } from './types';

export async function queryAlgoliaBeerIndex(
  config: AlgoliaSearchConfig,
  query: string,
): Promise<AlgoliaBeerHit[]> {
  const indexName = config.indexes.beer.all;
  const url = `https://${config.appId}-dsn.algolia.net/1/indexes/${indexName}/query`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Algolia-Application-Id': config.appId,
      'X-Algolia-API-Key': config.searchKey,
    },
    body: JSON.stringify({
      params: `query=${encodeURIComponent(query)}&hitsPerPage=${config.hitsPerPage}`,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new HTTPException(response.status, text || response.statusText);
  }

  const body: { hits: AlgoliaBeerHit[] } = await response.json();
  return body.hits;
}
