import searchBeers from './api/searchBeers';
import getBeer from './api/getBeer';

export type UntappdClientConfig = {
  baseUrl?: string;
};

export class UntappdClient {
  private readonly config?: UntappdClientConfig;

  constructor(config?: UntappdClientConfig) {
    if (config?.baseUrl && config.baseUrl.endsWith('/')) {
      console.warn(
        'Custom base url cannot end with a trailing slash. Stripping away trailing slash.',
      );
      config.baseUrl = config.baseUrl.slice(0, config.baseUrl.length - 1);
    }

    this.config = config;
  }

  searchBeers(name: string) {
    return searchBeers(name, this.config);
  }

  getBeer(id: string) {
    return getBeer(id, this.config);
  }
}
