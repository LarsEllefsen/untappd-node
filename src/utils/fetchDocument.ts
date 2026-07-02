import { JSDOM } from 'jsdom';
import HTTPException from '../common/HTTPException';
import { UNTAPPD_URL } from '../common/constants';

export default async function fetchDocument(
  baseUrl: string,
  path: string,
  searchParameters: URLSearchParams | undefined = undefined,
): Promise<{ document: Document; url: string }> {
  const params = searchParameters ? '?' + searchParameters.toString() : '';
  const urlToFetch = baseUrl + path + params;
  const response = await fetch(urlToFetch, { method: 'GET' });

  if (!response.ok) {
    const text = await response.text();
    const errorMessage = text && text !== '' ? text : response.statusText;
    throw new HTTPException(response.status, errorMessage);
  }

  const DOM = new JSDOM(await response.text());

  return {
    document: DOM.window.document,
    url: UNTAPPD_URL + path,
  };
}
