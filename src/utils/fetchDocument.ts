import { JSDOM } from "jsdom";

export default async function fetchDocument(
  url: string,
  searchParameters: URLSearchParams | undefined = undefined
): Promise<Document> {
  const params = searchParameters
    ? "?" + searchParameters.toString()
    : undefined;
  const response = await fetch(`${url}${params}`, { method: "GET" });
  return new JSDOM(await response.text()).window.document;
}