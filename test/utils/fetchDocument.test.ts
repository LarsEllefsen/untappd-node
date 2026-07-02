import { enableFetchMocks } from 'jest-fetch-mock';
import { getMockFile } from '../utils';
import fetchDocument from '../../src/utils/fetchDocument';

enableFetchMocks();

describe('fetch document', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('Should return a document when response is OK', async () => {
    fetchMock.mockResponse(getMockFile('get_beer_response'), {
      status: 200,
      url: 'https://untappd.com/b/some-beer/123',
    });

    const result = await fetchDocument(
      'https://untappd.com',
      '/b/some-beer/123',
    );

    expect(result.document).toBeDefined();
    expect(result.url).toBeDefined();
  });

  it('Should throw HTTPException for error status codes', async () => {
    fetchMock.mockResponse('Internal Server Error', {
      status: 500,
      statusText: 'Internal Server Error',
    });

    await expect(
      fetchDocument('https://untappd.com', '/b/some-beer/123'),
    ).rejects.toThrow();
  });

  it('Should throw HTTPException when blocked by Cloudflare (403)', async () => {
    fetchMock.mockResponse('Forbidden', {
      status: 403,
      statusText: 'Forbidden',
    });

    await expect(
      fetchDocument('https://untappd.com', '/b/some-beer/123'),
    ).rejects.toThrow();
  });
});
