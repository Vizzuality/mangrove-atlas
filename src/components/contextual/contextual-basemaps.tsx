import { useCallback, useState } from 'react';

import { cn } from 'lib/classnames';

import { activeLayersAtom } from 'store/layers';

import { useRecoilState } from 'recoil';

import { CONTEXTUAL_LAYERS_PLANET_SERIES_ATTRIBUTES } from 'containers/datasets/contextual-layers/constants';

import DateSelect from 'components/planet-date-select';
import RadioGroup from 'components/ui/radio-group';
import RadioGroupItem from 'components/ui/radio-group/radio-group-item';
import type { ActiveLayers } from 'types/layers';
import type { ContextualBasemapsId } from 'types/widget';

const BasemapsMapSettings = () => {
  const [activeLayers, setActiveLayers] = useRecoilState(activeLayersAtom);
  const defaultActive =
    activeLayers?.find((layer) => layer.id.includes('planet'))?.id || 'no-layer';
  const [isActive, setIsActive] = useState(defaultActive);

  const handleClick = useCallback(
    (id) => {
      setIsActive(id);
      const noPlanetLayers = activeLayers?.filter((w) => !w.id.includes('planet_medres'));
      const layersUpdate =
        id === 'no-layer'
          ? noPlanetLayers
          : ([
              {
                id: id as ContextualBasemapsId,
                opacity: '1',
                visibility: 'visible',
              },
              ...noPlanetLayers,
            ] as ActiveLayers[]);
      setActiveLayers(layersUpdate);
    },
    [activeLayers, setActiveLayers]
  );

  return (
    <div className="relative flex flex-col text-sm leading-4 text-black/85">
      <RadioGroup onValueChange={handleClick} defaultValue={defaultActive} className="space-y-2">
        <div className="flex space-x-4">
          <RadioGroupItem
            option={{ value: 'no-layer', label: 'No layer' }}
            data-testid="no-layer"
            label={false}
          />
          <label
            className={cn({
              'font-semibold text-brand-800': isActive === 'no-layer',
            })}
            htmlFor="No layer"
          >
            No layer
          </label>
        </div>

        {CONTEXTUAL_LAYERS_PLANET_SERIES_ATTRIBUTES.map(({ id, name, mosaic_id }) => {
          return (
            <div key={id} className="space-y-2">
              <div className="flex space-x-4">
                <RadioGroupItem
                  option={{ value: id, label: name }}
                  data-testid={id}
                  label={false}
                />
                <label
                  className={cn({
                    'font-semibold text-brand-800': isActive === id,
                  })}
                  htmlFor={id}
                >
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
      </RadioGroup>
    </div>
  );
};

export default BasemapsMapSettings;
