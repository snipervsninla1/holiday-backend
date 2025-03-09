export const regulariseSpacesFrom = (word: string, to = " "): string => {
  return word.trim().replace(/\s+/g, to);
};

const camelCaseAWord = (simpleWord: string): string =>
  `${simpleWord.slice(0,1).toUpperCase()}${simpleWord.slice(1).toLowerCase()}`;
export const toCamelCase = (word: string): string => {
  const splitWord = word.split("_");
  if (splitWord.length > 1) {
    return splitWord.reduce((previousValue, currentValue) =>
      `${camelCaseAWord(previousValue)}${camelCaseAWord(currentValue)}`);
  }
  return camelCaseAWord(word);
};