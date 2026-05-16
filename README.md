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

The recommended way to consume use this package is to instantiate a new UntappdClient which exposes all the availble functions:

```ts
import { UntappdClient } from 'untappd-node';

const client = new UntappdClient();
const results = await client.searchBeers('3 fonteinen');
```

It is possible to import and use the functions without a client if you wish to do so instead (But note that this may be deprecated in favor of the client in the future):

```ts
import { searchBeers } from 'untappd-node';

const results = await client.searchBeers('3 fonteinen');
```

## Documentation

### Configuration

You can configre the UntappdClient by passing a config object to the `UntappdClient` constructor:

```ts
import { UntappdClient } from 'untappd-node';

const client = new UntappdClient({ baseUrl: 'http://localhost:3000' });
```

Possible config values are:

- [baseUrl](#baseUrl)

#### baseUrl

Used to override the base url used. Can be useful for local testing or routing traffic through a proxy.

### API

#### searchBeers

`searchBeers(string) : Promise<SearchResult[]>`

Returns a list of `SearchResult` that matches your search. Returns an empty list if no results were found.

Example:

```ts
import { UntappdClient } from 'untappd-node';

const client = await new UntappdClient();
const results = await client.searchBeers('3 fonteinen');
```

#### getBeer

`getBeer(string) : Promise<Beer | null>`

Gets information about a beer with the given ID. Returns null if no beer was found.

Example:

```ts
import { UntappdClient } from 'untappd-node';

const client = await new UntappdClient();

const beer = await getBeer('144709');
if (beer !== null) {
  // Do something
}
```

### Error handling

The API will throw `HTTPException` if the call to Untappd fails for any reason. This `HTTPException` includes the status code and the corresponding error message:

```ts
import { UntappdClient } from 'untappd-node';
import type { HTTPException } from 'untappd-node';

const client = new UntappdClient();

try {
  const beer = await client.getBeer('1234');
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
