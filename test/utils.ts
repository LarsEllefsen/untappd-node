import fs from 'node:fs';
import path from 'node:path';

export function getMockFile(fileName: string, extension: string = 'html') {
  return fs
    .readFileSync(path.resolve(__dirname, `./mocks/${fileName}.${extension}`))
    .toString();
}
