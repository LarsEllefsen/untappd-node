import fetchDocument from "../../utils/fetchDocument";
import { getAbvFromString } from "../../utils/getAbvFromString";
import { GET_BEER_URL } from "./constants";
import { Beer } from "./types";

export default async function getBeer(id: string): Promise<Beer> {
  const document = await fetchDocument(GET_BEER_URL + id);

  const name = document.querySelector(".name > h1")?.textContent;
  if (!name) {
    throw new DOMException(
      'Unable to find beer name. Expected beer name to be found in ".name > h1"'
    );
  }

  const style = document.querySelector(".name > .style")?.textContent;
  if (!style) {
    throw new DOMException(
      'Unable to find beer style. Expected beer style to be found in ".name > .style"'
    );
  }

  const brewery = document.querySelector(".brewery > a")?.textContent;
  if (!brewery) {
    throw new DOMException(
      'Unable to find brewery. Expected brewery name to be found in ".brewery > a"'
    );
  }

  const abvString = document.querySelector(".details > .abv")?.textContent;
  if (!abvString) {
    throw new DOMException(
      'Unable to find ABV. Expected ABV to be found in ".details > .abv"'
    );
  }
  const abv = getAbvFromString(abvString);

  const image = (
    document.querySelector(".label > img") as HTMLImageElement | null
  )?.src;
  if (!image) {
    throw new DOMException(
      'Unable to find label image. Expected image to be found in ".label > img"'
    );
  }

  const ratingString = document
    .querySelector(".details > .caps[data-rating]")
    ?.getAttribute("data-rating");
  if (!ratingString) {
    throw new DOMException(
      'Unable to find rating. Expected rating to be found in ".details > .caps[data-rating]"'
    );
  }
  const rating = parseFloat(ratingString);
  if (Number.isNaN(rating)) {
    throw new TypeError(`Unable to parse ${ratingString} to number`);
  }

  const numRatingsString =
    document.querySelector(".details > .raters")?.textContent;
  if (!numRatingsString) {
    throw new DOMException(
      'Unable to find number of ratings. Expected number of ratings to be found in ".details > .raters"'
    );
  }
  const numRatings = getNumRatingsFromString(numRatingsString);

  return {
    id,
    name,
    style,
    brewery,
    abv,
    image,
    rating,
    numRatings,
  };
}

function getNumRatingsFromString(string: string): number {
  const splitString = string.split("Ratings");
  if (splitString.length != 2) {
    throw new DOMException(
      `Unable to get number of ratings from string ${string}, does not conform to expected format.`
    );
  }

  const numberOfRatings = parseInt(splitString[0].replace(",", ""));
  if (Number.isNaN(numberOfRatings)) {
    throw new TypeError(`Unable to parse ${numberOfRatings} to number`);
  }

  return numberOfRatings;
}
