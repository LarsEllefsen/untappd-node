import { SearchResult } from '../../types';
import { AlgoliaBeerHit } from './types';

export function searchResultsToBeerItems(hit: AlgoliaBeerHit): SearchResult {
  return {
    id: String(hit.bid),
    name: hit.beer_name,
    brewery: hit.brewery_name,
    style: hit.type_name,
    url: `https://untappd.com/b/${hit.beer_slug}/${hit.bid}`,
    rating: hit.rating_score,
    abv: hit.beer_abv,
  };
}
