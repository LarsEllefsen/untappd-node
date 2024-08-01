# untappd-node

**Note: This is not an official API. Breaking changes may occur at any time. Use at your own risk.**

Untappd-node is a lightweight third party API used to fetch data from Untappd. The API is fully typed in typescript and requires no API credentials.

## Installation

**Minimum node version: 20**

NPM:

```
npm install untappd-node
```

Yarn:

```
yarn add untappd-node
```

To use it simply import the functions you wish to use (Functions are documented below):

```ts
import { searchBeers } from 'untappd-node';

const results = await searchBeers('3 fonteinen');
```

## Documentation

### API

#### searchBeers

`searchBeers(string) : Promise<SearchResult[]>`

Returns a list of `SearchResult` that matches your search. Returns an empty list if no results were found.

Example:

```ts
import { searchBeers } from 'untappd-node';

const results = await searchBeers('3 fonteinen');
```

#### getBeer

`getBeer(string) : Promise<Beer | null>`

Gets information about a beer with the given ID. Returns null if no beer was found.

Example:

```ts
import { getBeer } from 'untappd-node';

const beer = await getBeer('144709');
if (beer !== null) {
  // Do something
}
```

### Error handling

The API will throw `HTTPException` if the call to Untappd fails for any reason. This `HTTPException` includes the status code and the corresponding error message:

```ts
import { getBeer } from 'untappd-node';
import type { HTTPException } from 'untappd-node';

try {
  const beer = await getBeer('1234');
  // ...
} catch (error) {
  if (error instanceof HTTPException) {
    // You now have typed access to statusCode and message
    console.log(error.statusCode);
  }
  // Generic error handling
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
