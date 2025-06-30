import { JSDOM } from 'jsdom';
import HTTPException from '../common/HTTPException';
import { getDocumentWithBrowser } from './getDocumentWithBrowser';

declare global {
  // eslint-disable-next-line no-var
  var untappdNodeHeaders: Record<string, string> | null;
}

export default async function fetchDocument(
  url: string,
  searchParameters: URLSearchParams | undefined = undefined,
): Promise<{ document: Document; url: string }> {
  const params = searchParameters ? '?' + searchParameters.toString() : '';
  const urlToFetch = url + params;
  const response = await fetch(urlToFetch, {
    method: 'GET',
    headers: global.untappdNodeHeaders ?? undefined,
  });

  let DOM: JSDOM;

  if (response.ok) {
    DOM = new JSDOM(await response.text());
  } else if (response.status === 403) {
    const { body, headers } = await getDocumentWithBrowser(urlToFetch);
    DOM = new JSDOM(body);
    global.untappdNodeHeaders = headers;
  } else {
    const text = await response.text();
    const errorMessage = text && text !== '' ? text : response.statusText;
    throw new HTTPException(response.status, errorMessage);
  }

  return {
    document: DOM.window.document,
    url: response.url,
  };
}
