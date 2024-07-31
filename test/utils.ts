import fs from 'node:fs';
import path from 'node:path';

export function getMockFile(fileName: string) {
  return fs
    .readFileSync(path.resolve(__dirname, `./mocks/${fileName}.html`))
    .toString();
}
