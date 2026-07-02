export type AlgoliaSearchConfig = {
  appId: string;
  searchKey: string;
  hitsPerPage: number;
  indexes: {
    beer: {
      all: string;
    };
  };
};

export type AlgoliaBeerHit = {
  bid: number;
  beer_name: string;
  beer_abv: number;
  brewery_name: string;
  type_name: string;
  beer_slug: string;
  rating_score: number;
};
