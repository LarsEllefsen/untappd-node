import fetchDocument from '../../utils/fetchDocument';
import {
  BEER_ITEM_CLASS_NAME,
  RESULTS_CONTAINER_CLASS_NAME,
  SEARCH_URL,
} from './constants';
import { searchResultsToBeerItems } from './mapper';

export default async function searchBeers(name: string) {
  const params = new URLSearchParams({ q: name });
  const searchResultsPage = await fetchDocument(SEARCH_URL, params);
  const searchResults = getSearchResultsFromPage(searchResultsPage);

  return searchResults.map(searchResultsToBeerItems);
}

function getSearchResultsFromPage(searchResultsPage: Document) {
  const searchResultContainer = Array.from(
    searchResultsPage.getElementsByClassName(RESULTS_CONTAINER_CLASS_NAME),
  );

  if (searchResultContainer.length != 1) {
    throw new DOMException(
      `Expected exactly one element with class .${RESULTS_CONTAINER_CLASS_NAME} in the document. Found ${searchResultContainer.length}`,
    );
  }

  const beerItems = Array.from(searchResultContainer[0].children);

  if (beerItems.length == 0) {
    return [];
  }

  if (
    !beerItems.every(DOMElement =>
      DOMElement.className.includes(BEER_ITEM_CLASS_NAME),
    )
  ) {
    throw new DOMException(
      `Unexpected DOM content when searching for beers. Expected every child inside .${RESULTS_CONTAINER_CLASS_NAME} to have class .${BEER_ITEM_CLASS_NAME}`,
    );
  }

  return beerItems;
}
