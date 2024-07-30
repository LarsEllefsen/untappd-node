import { enableFetchMocks } from "jest-fetch-mock";
enableFetchMocks();

import { getBeer } from "../../src";
import { getMockFile } from "../utils";

describe("get beer", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("should return a list of search results", async () => {
    fetchMock.mockResponse(getMockFile("get_beer_response"));

    const beer = await getBeer("144709");

    expect(beer.id).toBe("144709");
    expect(beer.name).toBe("3 Fonteinen Oude Geuze Golden Blend");
    expect(beer.style).toBe("Lambic - Gueuze");
    expect(beer.brewery).toBe("Brouwerij 3 Fonteinen");
    expect(beer.abv).toEqual(7.5);
    expect(beer.image).toBe(
      "https://assets.untappd.com/site/beer_logos/beer-144709_999e5_sm.jpeg"
    );
    expect(beer.rating).toEqual(4.36376);
    expect(beer.numRatings).toEqual(11272);
  });

  it("should throw DOMException if DOM is not as expected", async () => {
    fetchMock.mockResponse(getMockFile("get_beer_bad_response"));

    expect(getBeer("144709")).rejects.toThrow(
      'Unable to find ABV. Expected ABV to be found in ".details > .abv"'
    );
  });

  it("should handle missing abv", async () => {
    fetchMock.mockResponse(getMockFile("get_beer_missing_abv_response"));

    const beer = await getBeer("144709");

    expect(beer.abv).toBeUndefined();
  });

  it("should handle beers with no rating", async () => {
    fetchMock.mockResponse(getMockFile("get_beer_no_ratings_response"));

    const beer = await getBeer("144709");

    expect(beer.rating).toEqual(0);
  });
});