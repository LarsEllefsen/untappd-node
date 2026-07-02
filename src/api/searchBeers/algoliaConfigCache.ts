import { AlgoliaSearchConfig } from './types';

let cachedConfig: AlgoliaSearchConfig | null = null;

export function getCachedAlgoliaConfig(): AlgoliaSearchConfig | null {
  return cachedConfig;
}

export function setCachedAlgoliaConfig(config: AlgoliaSearchConfig): void {
  cachedConfig = config;
}

export function clearCachedAlgoliaConfig(): void {
  cachedConfig = null;
}
