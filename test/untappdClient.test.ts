import { enableFetchMocks } from 'jest-fetch-mock';
import { getMockFile } from './utils';
import { UntappdClient } from '../src';
enableFetchMocks();

describe('UntappdClient', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should return a beer', async () => {
    fetchMock.mockResponse(getMockFile('get_beer_response'), {
      url: 'https://untappd.com/b/brouwerij-3-fonteinen-3-fonteinen-oude-geuze-golden-blend/144709',
    });

    const untappdClient = new UntappdClient();
    const beer = await untappdClient.getBeer('144709');

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

  it('should return a beer with base url overriden by config', async () => {
    fetchMock.mockResponse(getMockFile('get_beer_response'), {
      url: 'https://overridden-url.com/b/brouwerij-3-fonteinen-3-fonteinen-oude-geuze-golden-blend/144709',
    });

    const untappdClient = new UntappdClient({
      baseUrl: 'https://overridden-url.com',
    });
    const beer = await untappdClient.getBeer('144709');

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

  it('should search for a product', async () => {
    fetchMock.mockResponse(getMockFile('search_beers_response'));

    const untappdClient = new UntappdClient();
    const items = await untappdClient.searchBeers('3 fonteinen');

    expect(items).toHaveLength(5);
    expect(items[0].name).toBe('3 Fonteinen Oude Geuze');
    expect(items[0].brewery).toBe('Brouwerij 3 Fonteinen');
    expect(items[0].style).toBe('Lambic - Gueuze');
    expect(items[0].abv).toEqual(6);
    expect(items[0].rating).toEqual(4.062);
    expect(items[0].url).toBe(
      'https://untappd.com/b/brouwerij-3-fonteinen-3-fonteinen-oude-geuze/4009',
    );
  });

  it('should search for a product with base url overridden by config', async () => {
    fetchMock.mockResponse(getMockFile('search_beers_response'));

    const untappdClient = new UntappdClient({
      baseUrl: 'http://overridden-url',
    });
    const items = await untappdClient.searchBeers('3 fonteinen');

    expect(items).toHaveLength(5);
    expect(items[0].name).toBe('3 Fonteinen Oude Geuze');
    expect(items[0].brewery).toBe('Brouwerij 3 Fonteinen');
    expect(items[0].style).toBe('Lambic - Gueuze');
    expect(items[0].abv).toEqual(6);
    expect(items[0].rating).toEqual(4.062);
    expect(items[0].url).toBe(
      'https://untappd.com/b/brouwerij-3-fonteinen-3-fonteinen-oude-geuze/4009',
    );
  });
});
