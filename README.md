# Simple search

This API provides a simple search function for searching sets of string values. It ranks search results based on score, higher score means that search term is more relatable. Main purpose of the API is to be used in places where simple search functionality is required. There is no search indexing and history management which means that the API will be slow for large datasets.

## How to use

Search function is relatively easy to understand:

```ts
import { search } from '@banez/search';

console.log(
  search({
    set: [
      {
        id: 'post1',
        data: [
          'This is post 1 description which is awesome!',
          'This is post 1 title.',
        ],
      },
      {
        id: 'post2',
        data: [
          'This is post 2 description.',
          'This is post 2 title and it is awesome!',
        ],
      },
    ],
    searchTerm: 'awesome',
  }),
);
/**
 * OUTPUT ------
 * {
 *  items: [
 *   { id: 'post2', score: 2, matches: 1, positions: [Array] },
 *   { id: 'post1', score: 0.2, matches: 1, positions: [Array] }
 *  ]
 * }
 */
```

*Snippet 1 - Example for how to use search function*

As it can be seen from example in Snippet 1, both search items have 1 match, which is expected. In **post1**, word `awesome` is located in the first item of the data and in **post2**, it is located in the second item in the data. If both items have 1 match, why is that scores are not the same? That is because strings, in the data of a set item, have priority. Larger the index of a string in the data, it will have higher effect on the score. For this, score transformation function is used.

If a score transformation function is not provided by a user of the API, default linear function will is used.

```text
  y
  |      / y=k*x+n
  |     /        
H |___ . (x, y)     1: l=0; L=0*k+n -> n=L
  |   /|                            
  |  / |                            H-L
  | /  |            2: H=h*k+L -> k=---
L |/   |                             h
  |    |
  └───────── x      y=((H-L)/h)*x+L
  l    h
```

For default transformation function:

- H = 1
- L = 0.1
- l = 0
- h = 1

If example from Snippet 1 is used, score for the first string in the data will be multiplied with 0.1, while score for the second string will be multiplied by 1.
