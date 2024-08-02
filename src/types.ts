export type Beer = {
  id: string;
  name: string;
  brewery: string;
  style: string;
  abv?: number;
  image: string;
  rating: number;
  numRatings: number;
  url: string;
};

export type SearchResult = {
  id: string;
  name: string;
  brewery: string;
  style: string;
  url: string;
  abv?: number;
  rating: number;
};
