import { useMemo } from 'react';

import diacritics from 'diacritics';
import Fuse from 'fuse.js';

export const useSearch = <T = unknown>(
  items: T[] | undefined,
  search: string,
  fields: string[]
): T[] => {
  // `fields` is usually an inline array literal, so key the memo on its content.
  const fieldsKey = fields.join('|');

  const fuse = useMemo(
    () =>
      new Fuse(items ?? [], {
        keys: fieldsKey.split('|'),
        shouldSort: true,
        includeMatches: true,
        threshold: 0.3,
        location: 0,
        distance: 300,
        minMatchCharLength: 1,
      }),
    [items, fieldsKey]
  );

  return useMemo(
    () => (search ? fuse.search(diacritics.remove(search)).map((d) => d.item) : []),
    [search, fuse]
  );
};
