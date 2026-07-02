import { ALGOLIA_CONFIG_GLOBAL_VAR_NAME } from './constants';
import { AlgoliaSearchConfig } from './types';

export function getAlgoliaSearchConfig(
  document: Document,
): AlgoliaSearchConfig {
  const configScript = Array.from(document.getElementsByTagName('script'))
    .map(script => script.textContent ?? '')
    .find(text => text.includes(ALGOLIA_CONFIG_GLOBAL_VAR_NAME));

  const match = configScript?.match(
    new RegExp(`${ALGOLIA_CONFIG_GLOBAL_VAR_NAME}\\s*=\\s*(\\{.*\\});`),
  );

  if (!match) {
    throw new DOMException(
      `Unable to find Algolia search configuration in the document. Expected a script tag setting window.${ALGOLIA_CONFIG_GLOBAL_VAR_NAME}`,
    );
  }

  return JSON.parse(match[1]);
}
