import { UNTAPPD_URL } from '../../common/constants';
import HTTPException from '../../common/HTTPException';
import fetchDocument from '../../utils/fetchDocument';
import { getAlgoliaSearchConfig } from './algoliaConfig';
import {
  clearCachedAlgoliaConfig,
  getCachedAlgoliaConfig,
  setCachedAlgoliaConfig,
} from './algoliaConfigCache';
import { queryAlgoliaBeerIndex } from './algoliaClient';
import { SEARCH_PATH } from './constants';
import { searchResultsToBeerItems } from './mapper';
import { AlgoliaSearchConfig } from './types';

const ALGOLIA_AUTH_ERROR_STATUS_CODES = [401, 403, 404];

export default async function searchBeers(
  name: string,
  options?: { baseUrl?: string },
) {
  const baseUrl = options?.baseUrl ?? UNTAPPD_URL;

  let config = getCachedAlgoliaConfig();
  if (!config) {
    config = await fetchAlgoliaSearchConfig(baseUrl, name);
    setCachedAlgoliaConfig(config);
  }

  try {
    return await searchWithConfig(config, name);
  } catch (error) {
    if (
      error instanceof HTTPException &&
      ALGOLIA_AUTH_ERROR_STATUS_CODES.includes(error.statusCode)
    ) {
      clearCachedAlgoliaConfig();
      const freshConfig = await fetchAlgoliaSearchConfig(baseUrl, name);
      setCachedAlgoliaConfig(freshConfig);
      return await searchWithConfig(freshConfig, name);
    }
    throw error;
  }
}

async function searchWithConfig(config: AlgoliaSearchConfig, name: string) {
  const hits = await queryAlgoliaBeerIndex(config, name);
  return hits.map(searchResultsToBeerItems);
}

async function fetchAlgoliaSearchConfig(baseUrl: string, name: string) {
  const params = new URLSearchParams({ q: name });
  const { document } = await fetchDocument(baseUrl, SEARCH_PATH, params);
  return getAlgoliaSearchConfig(document);
}
