import { enableFetchMocks } from 'jest-fetch-mock';
enableFetchMocks();

import { getBeer } from '../../src';
import { getMockFile } from '../utils';
import HTTPException from '../../src/common/HTTPException';

describe('get beer', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should return a beer', async () => {
    fetchMock.mockResponse(getMockFile('get_beer_response'), {
      url: 'https://untappd.com/b/brouwerij-3-fonteinen-3-fonteinen-oude-geuze-golden-blend/144709',
    });

    const beer = await getBeer('144709');

    expect(beer).not.toBeNull();
    expect(beer?.id).toBe('144709');
    expect(beer?.name).toBe('3 Fonteinen Oude Geuze Golden Blend');
    expect(beer?.style).toBe('Lambic - Gueuze');
    expect(beer?.brewery).toBe('Brouwerij 3 Fonteinen');
    expect(beer?.abv).toEqual(7.5);
    expect(beer?.image).toBe(
      'https://assets.untappd.com/site/beer_logos/beer-144709_999e5_sm.jpeg',
    );
    expect(beer?.rating).toEqual(4.36376);
    expect(beer?.numRatings).toEqual(11272);
    expect(beer?.url).toBe(
      'https://untappd.com/b/brouwerij-3-fonteinen-3-fonteinen-oude-geuze-golden-blend/144709',
    );
  });

  it('should throw DOMException if DOM is not as expected', async () => {
    fetchMock.mockResponse(getMockFile('get_beer_bad_response'));

    expect(getBeer('144709')).rejects.toThrow(
      'Unable to find ABV. Expected ABV to be found in ".details > .abv"',
    );
  });

  it('should handle missing abv', async () => {
    fetchMock.mockResponse(getMockFile('get_beer_missing_abv_response'));

    const beer = await getBeer('144709');

    expect(beer).not.toBeNull();
    expect(beer?.abv).toBeUndefined();
  });

  it('should handle beers with no rating', async () => {
    fetchMock.mockResponse(getMockFile('get_beer_no_ratings_response'));

    const beer = await getBeer('144709');

    expect(beer).not.toBeNull();
    expect(beer?.rating).toEqual(0);
  });

  it('should throw HTTPException if response was not ok', async () => {
    const expectedException = new HTTPException(429, 'Too many requests');
    fetchMock.mockResponse('', {
      status: 429,
      statusText: 'Too many requests',
    });

    expect(getBeer('144709')).rejects.toThrow(expectedException);
  });

  it('should return null if response is 404', async () => {
    fetchMock.mockResponse(getMockFile('get_beer_not_found_response'), {
      status: 404,
    });

    const beer = await getBeer('-1');

    expect(beer).toBeNull();
  });

  it('should be able to get number of ratings when product only has 1 rating', async () => {
    fetchMock.mockResponse(getMockFile('get_beer_1_rating_response'));

    const beer = await getBeer('5735374');

    expect(beer?.numRatings).toBe(1);
  });
});
