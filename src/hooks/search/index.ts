import { useMemo } from 'react';

import Fuse from 'fuse.js';

type Items = unknown[];

export const useSearch = (items: Items[], search: string, fields: string[]) => {
  const fuse =
    search &&
    search.length &&
    (new Fuse(items, {
      keys: fields,
      shouldSort: true,
      includeMatches: true,
      threshold: 0.1,
      location: 0,
      distance: 300,
      minMatchCharLength: 1,
    }) satisfies Fuse<Items>);

  return useMemo(
    () => fuse && fuse.search(search).map((d) => d.item),
    [search, fuse]
  ) satisfies Items[];
};
