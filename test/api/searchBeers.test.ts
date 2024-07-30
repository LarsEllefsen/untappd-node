import { enableFetchMocks } from "jest-fetch-mock";
enableFetchMocks();

import { searchBeers } from "../../src";
import { getMockFile } from "../utils";
import { RESULTS_CONTAINER_CLASS_NAME } from "../../src/api/searchBeers/constants";

describe("Search beers", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("should return a list of search results", async () => {
    fetchMock.mockResponse(getMockFile("search_beers_response"));

    const items = await searchBeers("3 fonteinen");

    expect(items).toHaveLength(5);
    expect(items[0].name).toBe("3 Fonteinen Oude Geuze");
    expect(items[0].brewery).toBe("Brouwerij 3 Fonteinen");
    expect(items[0].style).toBe("Lambic - Gueuze");
    expect(items[0].abv).toEqual(6);
    expect(items[0].rating).toEqual(4.062);
    expect(items[0].url).toBe(
      "https://untappd.com/b/brouwerij-3-fonteinen-3-fonteinen-oude-geuze/4009"
    );
  });

  it("should throw DOMException if DOM is not as expected", async () => {
    fetchMock.mockResponse(getMockFile("search_beers_bad_response"));

    expect(searchBeers("3 fonteinen")).rejects.toThrow(
      `Expected exactly one element with class .${RESULTS_CONTAINER_CLASS_NAME} in the document. Found 0`
    );
  });
});
