import { useMemo } from 'react';

import Fuse from 'fuse.js';

export const useSearch = <T = unknown>(items: T[], search: string, fields: string[]) => {
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
    }) satisfies Fuse<T>);

  return useMemo(
    () => fuse && fuse.search(search).map((d) => d.item),
    [search, fuse]
  ) satisfies T[];
};
