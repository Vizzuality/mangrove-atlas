import { useCallback } from 'react';

import { activeLayersAtom } from 'store/layers';

import { useRecoilState } from 'recoil';

import { CONTEXTUAL_LAYERS_PLANET_SERIES_ATTRIBUTES } from 'containers/datasets/contextual-layers/constants';

import DateSelect from 'components/planet-date-select';
import RadioGroupDemo from 'components/radio-group';
import RadioGroupItem from 'components/radio-group/radio-group-item';
import type { ActiveLayers } from 'types/layers';

const BasemapsMapSettings = () => {
  const [activeLayers, setActiveLayers] = useRecoilState(activeLayersAtom);

  const handleClick = useCallback((option) => {
    const isActive = activeLayers.find((layer) => layer.id === option);
    const layersUpdate = !!isActive
      ? activeLayers.filter((w) => w.id !== option)
      : ([
          {
            id: option,
            opacity: '1',
            visibility: 'visible',
          },
          ...activeLayers,
        ] as ActiveLayers[]);
    setActiveLayers(layersUpdate);
  }, []);
  return (
    <div className="relative flex flex-col pb-4 font-light text-black/85">
      <RadioGroupDemo onValueChange={handleClick}>
        {CONTEXTUAL_LAYERS_PLANET_SERIES_ATTRIBUTES.map(({ id, name, mosaic_id }) => {
          const layerToUpdate = activeLayers.find((layer) => id === layer.id);
          return (
            <div key={id} className="ml-0.5 flex flex-col">
              <div className="flex items-center space-x-4 py-1 font-light text-black/85">
                <RadioGroupItem option={{ label: name, value: id }} data-testid={id} />
              </div>
              {!!layerToUpdate && (
                <div className="ml-6">
                  <DateSelect key={id} mosaic_id={mosaic_id} id={id} />
                </div>
              )}
            </div>
          );
        })}
      </RadioGroupDemo>
    </div>
  );
};

export default BasemapsMapSettings;
