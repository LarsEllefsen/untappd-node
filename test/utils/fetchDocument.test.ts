import { enableFetchMocks } from 'jest-fetch-mock';
import { getMockFile } from '../utils';
import fetchDocument from '../../src/utils/fetchDocument';
import { getDocumentWithBrowser } from '../../src/utils/getDocumentWithBrowser';

enableFetchMocks();

jest.mock('../../src/utils/getDocumentWithBrowser', () => ({
  getDocumentWithBrowser: jest.fn(),
}));

const mockGetDocumentWithBrowser =
  getDocumentWithBrowser as jest.MockedFunction<typeof getDocumentWithBrowser>;

describe('fetch document', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    mockGetDocumentWithBrowser.mockReset();
    global.untappdNodeHeaders = null;
  });

  it('Should get document with headless browser if regular fetch returns 403', async () => {
    fetchMock.mockResponse(getMockFile('cloudflare_challenge_response'), {
      status: 403,
      url: 'https://untappd.com/b/brouwerij-3-fonteinen-3-fonteinen-oude-geuze-golden-blend/144709',
    });

    const mockBrowserResponse = {
      body: getMockFile('get_beer_response'),
      headers: {
        'user-agent': 'mocked-browser-agent',
        accept: 'text/html',
        cf_clearance: 'test',
      },
    };
    mockGetDocumentWithBrowser.mockResolvedValue(mockBrowserResponse);

    // Call fetchDocument
    const result = await fetchDocument(
      'https://untappd.com/b/brouwerij-3-fonteinen-3-fonteinen-oude-geuze-golden-blend/144709',
    );

    // Verify the mock was called
    expect(mockGetDocumentWithBrowser).toHaveBeenCalledTimes(1);
    expect(mockGetDocumentWithBrowser).toHaveBeenCalledWith(
      'https://untappd.com/b/brouwerij-3-fonteinen-3-fonteinen-oude-geuze-golden-blend/144709',
    );

    // Verify the result contains a document
    expect(result.document).toBeDefined();
    expect(result.url).toBeDefined();

    // Verify that global headers were set
    expect(global.untappdNodeHeaders).toEqual(mockBrowserResponse.headers);
  });

  it('Should set global headers if browser was used, then use global headers on subsequent fetch calls', async () => {
    // First call - Mock fetch to return 403 status
    fetchMock.mockResponseOnce(getMockFile('cloudflare_challenge_response'), {
      status: 403,
      url: 'https://untappd.com/b/brouwerij-3-fonteinen-3-fonteinen-oude-geuze-golden-blend/144709',
    });

    const mockBrowserResponse = {
      body: getMockFile('get_beer_response'),
      headers: {
        'user-agent': 'mocked-browser-agent',
        accept: 'text/html',
        cf_clearance: 'test-clearance-token',
        cookie: 'session=abc123',
      },
    };
    mockGetDocumentWithBrowser.mockResolvedValue(mockBrowserResponse);

    // First call - should trigger browser fallback
    const result1 = await fetchDocument(
      'https://untappd.com/b/brouwerij-3-fonteinen-3-fonteinen-oude-geuze-golden-blend/144709',
    );

    // Verify the browser mock was called
    expect(mockGetDocumentWithBrowser).toHaveBeenCalledTimes(1);
    expect(mockGetDocumentWithBrowser).toHaveBeenCalledWith(
      'https://untappd.com/b/brouwerij-3-fonteinen-3-fonteinen-oude-geuze-golden-blend/144709',
    );

    // Verify the result contains a document
    expect(result1.document).toBeDefined();
    expect(result1.url).toBeDefined();

    // Verify that global headers were set
    expect(global.untappdNodeHeaders).toEqual(mockBrowserResponse.headers);

    // Second call - Mock fetch to return success with the headers
    fetchMock.mockResponseOnce(getMockFile('get_beer_response'), {
      status: 200,
      url: 'https://untappd.com/b/another-beer/456',
    });

    // Second call - should use the previously set headers
    const result2 = await fetchDocument(
      'https://untappd.com/b/another-beer/456',
    );

    // Verify the browser mock was NOT called again
    expect(mockGetDocumentWithBrowser).toHaveBeenCalledTimes(1);

    // Verify the result
    expect(result2.document).toBeDefined();
    expect(result2.url).toBeDefined();

    // Verify that fetch was called with the headers from the browser
    expect(fetchMock).toHaveBeenLastCalledWith(
      'https://untappd.com/b/another-beer/456',
      {
        method: 'GET',
        headers: mockBrowserResponse.headers,
      },
    );
  });

  it('Should use regular fetch when response is OK', async () => {
    // Mock fetch to return successful response
    fetchMock.mockResponse(getMockFile('get_beer_response'), {
      status: 200,
      url: 'https://untappd.com/b/some-beer/123',
    });

    const result = await fetchDocument('https://untappd.com/b/some-beer/123');

    // Verify getDocumentWithBrowser was NOT called
    expect(mockGetDocumentWithBrowser).not.toHaveBeenCalled();

    // Verify the result
    expect(result.document).toBeDefined();
    expect(result.url).toBeDefined();
  });

  it('Should throw HTTPException for other error status codes', async () => {
    // Mock fetch to return 500 status
    fetchMock.mockResponse('Internal Server Error', {
      status: 500,
      statusText: 'Internal Server Error',
    });

    await expect(
      fetchDocument('https://untappd.com/b/some-beer/123'),
    ).rejects.toThrow();

    // Verify getDocumentWithBrowser was NOT called
    expect(mockGetDocumentWithBrowser).not.toHaveBeenCalled();
  });
});
