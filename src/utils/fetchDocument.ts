import { JSDOM } from 'jsdom';
import HTTPException from '../common/HTTPException';

export default async function fetchDocument(
  url: string,
  searchParameters: URLSearchParams | undefined = undefined,
): Promise<{ document: Document; url: string }> {
  const params = searchParameters ? '?' + searchParameters.toString() : '';
  const response = await fetch(`${url}${params}`, { method: 'GET' });

  if (!response.ok) {
    throw new HTTPException(response.status, response.statusText);
  }

  return {
    document: new JSDOM(await response.text()).window.document,
    url: response.url,
  };
}
