export function getAbvFromString(string: string): number | undefined {
  if (string.includes("N/A")) {
    return undefined;
  }

  const splitString = string.split("%");
  if (splitString.length != 2) {
    throw new DOMException(
      `Unable to get ABV from string ${string}, does not conform to expected format.`
    );
  }

  const rating = parseFloat(splitString[0]);
  if (Number.isNaN(rating)) {
    throw new TypeError(`Unable to parse ${rating} to number`);
  }

  return rating;
}
