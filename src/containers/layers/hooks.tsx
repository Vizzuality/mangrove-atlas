import { useMemo } from 'react';

import compact from 'lodash-es/compact';

import { LAYERS } from './constants';

export function useActiveLayers(slugs) {
  return useMemo(
    () =>
      compact(
        LAYERS.map(({ id, name }) => {
          if (slugs.includes(id)) {
            return name;
          }
        })
      ),
    [slugs]
  );
}
