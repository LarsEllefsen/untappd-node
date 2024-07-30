import { getAbvFromString } from "../../utils/getAbvFromString";
import { BEER_DETAILS_CLASS_NAME } from "./constants";
import { BeerItem } from "./types";

export function searchResultsToBeerItems(element: Element): BeerItem {
  const beerDetails = Array.from(
    element.getElementsByClassName(BEER_DETAILS_CLASS_NAME)
  );

  const anchorTag = element.querySelector<HTMLAnchorElement>(".name > a");
  if (anchorTag == null) {
    throw new DOMException(
      'Unable to find link to beer in search results. Expected link to be found in element ".name > a"'
    );
  }
  const id = getIDFromLink(anchorTag.href);
  const name = anchorTag.textContent;
  const url = "https://untappd.com" + anchorTag.href;

  if (name === null) {
    throw new DOMException(
      'Unable to find beer name in search results. Expected beer name to be found in element ".name > a"'
    );
  }

  const brewery = element.querySelector(
    ".beer-details > .brewery"
  )?.textContent;
  if (!brewery) {
    throw new DOMException(
      'Unable to get name of brewery for search result. Expected brewery name to be in element ".beer-details > .brewery"'
    );
  }

  const style = element.querySelector(".beer-details > .style")?.textContent;
  if (!style) {
    throw new DOMException(
      'Unable to get style for search result. Expected style to be in element ".beer-details > .style"'
    );
  }

  const ratingString = element
    .querySelector(".rating > .caps[data-rating]")
    ?.getAttribute("data-rating");
  if (!ratingString) {
    throw new DOMException(
      'Unable to find rating for beer in search results. Expected rating to be found in .rating > .caps[data-rating]"'
    );
  }
  const rating = parseFloat(ratingString);
  if (Number.isNaN(rating)) {
    throw new TypeError(`Unable to parse ${ratingString} to number`);
  }

  const abvString = element.querySelector(".details > .abv")?.textContent;
  if (!abvString) {
    throw new DOMException(
      'Unable to find ABV. Expected ABV to be found in ".details > .abv"'
    );
  }
  const abv = getAbvFromString(abvString);

  return {
    id,
    name,
    style,
    brewery,
    url,
    rating,
    abv,
  };
}

function getIDFromLink(link: string) {
  const splitString = link?.split("/");
  return splitString[splitString.length - 1];
}
