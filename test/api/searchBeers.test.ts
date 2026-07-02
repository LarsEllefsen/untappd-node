import { enableFetchMocks } from 'jest-fetch-mock';
enableFetchMocks();

import { searchBeers } from '../../src';
import { getMockFile } from '../utils';
import { ALGOLIA_CONFIG_GLOBAL_VAR_NAME } from '../../src/api/searchBeers/constants';
import { clearCachedAlgoliaConfig } from '../../src/api/searchBeers/algoliaConfigCache';
import HTTPException from '../../src/common/HTTPException';

describe('Search beers', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    clearCachedAlgoliaConfig();
  });

  it('should return a list of search results', async () => {
    fetchMock.mockResponses(
      getMockFile('search_beers_response'),
      getMockFile('search_beers_algolia_response', 'json'),
    );

    const items = await searchBeers('3 fonteinen');

    expect(items).toHaveLength(5);
    expect(items[0].name).toBe('Oude Geuze');
    expect(items[0].brewery).toBe('Brouwerij 3 Fonteinen');
    expect(items[0].style).toBe('Lambic - Gueuze');
    expect(items[0].abv).toEqual(6);
    expect(items[0].rating).toEqual(4.062);
    expect(items[0].url).toBe(
      'https://untappd.com/b/brouwerij-3-fonteinen-3-fonteinen-oude-geuze/4009',
    );
  });

  it('should throw DOMException if the Algolia search config cannot be found', async () => {
    fetchMock.mockResponse(getMockFile('search_beers_bad_response'));

    expect(searchBeers('3 fonteinen')).rejects.toThrow(
      `Unable to find Algolia search configuration in the document. Expected a script tag setting window.${ALGOLIA_CONFIG_GLOBAL_VAR_NAME}`,
    );
  });

  it('should return abv as a number, including 0% ABV beers', async () => {
    fetchMock.mockResponses(
      getMockFile('search_beers_response'),
      getMockFile('search_beers_algolia_zero_abv_response', 'json'),
    );

    const items = await searchBeers('heineken 0.0');

    expect(items[0].abv).toEqual(0);
  });

  it('should return empty list if search returns no results', async () => {
    fetchMock.mockResponses(
      getMockFile('search_beers_response'),
      getMockFile('search_beers_algolia_no_hits_response', 'json'),
    );

    const items = await searchBeers('Beer That Doesnt Exist');

    expect(items).toHaveLength(0);
  });

  it('should throw HTTPException if response was not ok', async () => {
    const expectedException = new HTTPException(429, 'Too many requests');
    fetchMock.mockResponse('', {
      status: 429,
      statusText: 'Too many requests',
    });

    expect(searchBeers('Beer That Doesnt Exist')).rejects.toThrow(
      expectedException,
    );
  });

  it('should not refetch the search page once the Algolia config is cached', async () => {
    fetchMock.mockResponses(
      getMockFile('search_beers_response'),
      getMockFile('search_beers_algolia_response', 'json'),
      getMockFile('search_beers_algolia_response', 'json'),
    );

    await searchBeers('3 fonteinen');
    await searchBeers('3 fonteinen');

    expect(fetchMock.mock.calls).toHaveLength(3);
  });

  it('should refetch the config and retry once if Algolia rejects the cached credentials', async () => {
    fetchMock.mockResponses(
      getMockFile('search_beers_response'),
      getMockFile('search_beers_algolia_response', 'json'),
      ['', { status: 401, statusText: 'Unauthorized' }],
      getMockFile('search_beers_response'),
      getMockFile('search_beers_algolia_response', 'json'),
    );

    const first = await searchBeers('3 fonteinen');
    expect(first).toHaveLength(5);

    const second = await searchBeers('3 fonteinen');
    expect(second).toHaveLength(5);

    expect(fetchMock.mock.calls).toHaveLength(5);
  });
});
