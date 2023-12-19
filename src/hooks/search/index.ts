import { useMemo } from 'react';

import diacritics from 'diacritics';
import Fuse from 'fuse.js';

type ItemWithAccents<T> = T & { name: string };

export const useSearch = <T = unknown>(items: T[], search: string, fields: string[]) => {
  const itemsNamesWithoutAccents: ItemWithAccents<T>[] = items.map((item: ItemWithAccents<T>) => ({
    ...item,
    name: item.name ? item.name.normalize('NFD').replace(/[\u0300-\u036F]/g, '') : '',
  }));
  const fuse =
    search &&
    search.length &&
    (new Fuse(itemsNamesWithoutAccents, {
      keys: fields,
      shouldSort: true,
      includeMatches: true,
      threshold: 0.1,
      location: 0,
      distance: 300,
      minMatchCharLength: 1,
    }) satisfies Fuse<T>);

  return useMemo(
    () => fuse && fuse.search(diacritics.remove(search)).map((d) => d.item),
    [search, fuse]
  ) satisfies T[];
};
