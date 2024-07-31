import { JSDOM } from "jsdom";
import { HTTPException } from "../common/HTTPException";

export default async function fetchDocument(
  url: string,
  searchParameters: URLSearchParams | undefined = undefined
): Promise<Document> {
  const params = searchParameters
    ? "?" + searchParameters.toString()
    : undefined;
  const response = await fetch(`${url}${params}`, { method: "GET" });

  if (!response.ok) {
    throw new HTTPException(response.status, response.statusText);
  }

  return new JSDOM(await response.text()).window.document;
}
