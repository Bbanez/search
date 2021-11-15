import type {
  SearchResult,
  SearchScoreTransFunction,
  SearchSetItem,
} from './types';

function searchScoreTransFn(position: number): number {
  return 0.9 * position + 0.1;
}

const wordSplitChars = [
  ' ',
  '-',
  '_',
  '+',
  '=',
  '|',
  '\\',
  '?',
  '!',
  '.',
  ',',
  ';',
  ':',
  "'",
  '"',
  '(',
  ')',
  '{',
  '}',
  '[',
  ']',
  '&',
  '*',
  '^',
  '%',
  '$',
  '#',
  '@',
  '\t',
  '\n',
  '\r',
];

export function search({
  set,
  searchTerm,
  transFn,
}: {
  set: SearchSetItem[];
  searchTerm: string;
  transFn?: SearchScoreTransFunction;
}): SearchResult {
  const tfn = transFn ? transFn : searchScoreTransFn;
  const output: SearchResult = {
    items: [],
  };
  for (let i = 0; i < set.length; i++) {
    const setItem = set[i];
    const outputIndex =
      output.items.push({
        id: setItem.id,
        score: 0,
        matches: 0,
        positions: [],
      }) - 1;
    for (let j = 0; j < setItem.data.length; j++) {
      const data = setItem.data[j];
      const positionsIndex = output.items[outputIndex].positions.push([]) - 1;
      let score = 0;
      let matches = 0;
      let loop = true;
      let index = 0;
      while (loop) {
        index = data.indexOf(searchTerm, index);
        if (index === -1) {
          loop = false;
        } else {
          matches++;
          score++;
          output.items[outputIndex].positions[positionsIndex].push(index);
          const newIndex = index + searchTerm.length;
          if (
            (index - 1 === -1 ||
              wordSplitChars.includes(data.charAt(index - 1))) &&
            (newIndex === data.length ||
              wordSplitChars.includes(data.charAt(newIndex)))
          ) {
            score++;
          }
          index = newIndex;
        }
      }
      output.items[outputIndex].matches += matches;
      output.items[outputIndex].score += score * tfn(j);
    }
  }
  output.items = output.items
    .filter((e) => e.score > 0)
    .sort((a, b) => (a.score > b.score ? -1 : 1));
  return output;
}
