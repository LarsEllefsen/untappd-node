# Untappd API

**Note: This is not an official API. Breaking changes may occur at any time. Use at your own risk.**

## Installation

**Minimum node version: 20**

NPM:

```
npm install untappd-api
```

Yarn:

```
yarn add untappd-api
```

To use it simply import the functions you wish to use (Functions are documented below):

```ts
import { searchBeers } from "untappd-api";

const results = await searchBeers("3 fonteinen");
```

## Documentation

### API

#### searchBeers

`searchBeers(string) : Promise<SearchResult[]>`

Returns a list of `SearchResult` that matches your search. Returns an empty list if no results were found.

Example:

```ts
import { searchBeers } from "untappd-api";

const results = await searchBeers("3 fonteinen");
```

#### getBeer

`getBeer(string) : Promise<Beer | null>`

Gets information about a beer with the given ID. Returns null if no beer was found.

Example:

```ts
import { getBeer } from "untappd-api";

const beer = await getBeer("144709");
if (beer !== null) {
  // Do something
}
```

### Types

#### SearchResult

```ts
type SearchResult = {
  id: string;
  name: string;
  brewery: string;
  style: string;
  url: string;
  abv?: number;
  rating: number;
};
```

#### Beer

```ts
type Beer = {
  id: string;
  name: string;
  brewery: string;
  style: string;
  abv?: number;
  image: string;
  rating: number;
  numRatings: number;
};
```
