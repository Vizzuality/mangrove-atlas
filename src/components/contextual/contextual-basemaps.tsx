import { useCallback, useState } from 'react';

import cn from 'lib/classnames';

import { activeLayersAtom } from 'store/layers';

import { useRecoilState } from 'recoil';

import { CONTEXTUAL_LAYERS_PLANET_SERIES_ATTRIBUTES } from 'containers/datasets/contextual-layers/constants';

import { Checkbox } from 'components/checkbox';
import DateSelect from 'components/planet-date-select';
import type { ActiveLayers } from 'types/layers';
import type { ContextualBasemapsId } from 'types/widget';

const BasemapsMapSettings = () => {
  const [activeLayers, setActiveLayers] = useRecoilState(activeLayersAtom);
  const defaultActive = activeLayers.find((layer) => layer.id.includes('planet'))?.id || null;
  const [isActive, setIsActive] = useState(defaultActive);

  const handleClick = useCallback(
    (id) => {
      if (isActive === id) {
        setIsActive(null);
      } else setIsActive(id);

      const layersUpdate =
        !!activeLayers.find((layer) => layer.id === id) && isActive === null
          ? activeLayers.filter((w) => w.id !== id)
          : ([
              {
                id: id as ContextualBasemapsId,
                opacity: '1',
                visibility: 'visible',
              },
              ...activeLayers,
            ] as ActiveLayers[]);

      setActiveLayers(layersUpdate);
    },
    [activeLayers, setActiveLayers, isActive]
  );

  return (
    <div className="relative flex flex-col pb-4 font-light text-black/85">
      <>
        {CONTEXTUAL_LAYERS_PLANET_SERIES_ATTRIBUTES.map(({ id, name, mosaic_id }) => {
          return (
            <div key={id} className="ml-0.5 flex flex-col">
              <div className="flex items-center space-x-4 py-1 font-light text-black/85">
                <Checkbox
                  id={id}
                  className={cn({
                    'flex h-3 w-3 shrink-0 items-center justify-center rounded-full border border-black/85':
                      true,
                    'border-4 border-brand-800': id === isActive,
                  })}
                  onCheckedChange={() => {
                    handleClick(id);
                  }}
                  data-testid={id}
                  checked={!!activeLayers.find((layer) => layer.id === id) && isActive === id}
                />
                <label className="font-sm m-0 text-sm font-semibold text-brand-800" htmlFor={id}>
                  {name}
                </label>
              </div>

              {isActive === id && (
                <div className="ml-6">
                  <DateSelect
                    key={id}
                    mosaic_id={mosaic_id}
                    id={id}
                    className={{ content: 'w-[460px]' }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </>
    </div>
  );
};

export default BasemapsMapSettings;
