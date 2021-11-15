import * as fs from 'fs/promises';
import * as path from 'path';
import { search } from '../src';
import type { SearchSetItem } from '../src/types';

describe('Search', async () => {
  it('should test search for "and" keyword', async () => {
    const set: SearchSetItem[] = (
      await fs.readFile(path.join(__dirname, 'assets', 'gpl-3.0.txt'))
    )
      .toString()
      .split('\n')
      .map((e, i) => {
        return {
          id: '' + (i + 1),
          data: [e.toLowerCase()],
        };
      });
    set[12].data.push('and');
    const result = search({
      set,
      searchTerm: 'and',
    });
    console.log(JSON.stringify(result.items.slice(0, 10), null, '  '));

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
  });
});
