import { useCallback, useState } from 'react';

import cn from 'lib/classnames';

import { activeLayersAtom } from 'store/layers';

import { useRecoilState } from 'recoil';

import { HIGH_RESOLUTION_EXTENT } from 'containers/datasets/contextual-layers/constants';

import RadioGroup from 'components/ui/radio-group';
import RadioGroupItem from 'components/ui/radio-group/radio-group-item';
import type { ActiveLayers } from 'types/layers';
import type { ContextualBasemapsId } from 'types/widget';

const HighResolutionExtentBasemap = () => {
  const [activeLayers, setActiveLayers] = useRecoilState(activeLayersAtom);
  const defaultActive =
    activeLayers.find((layer) => layer.id === 'hi-res-extent')?.id || 'no-layer';
  const [isActive, setIsActive] = useState(defaultActive);

  const handleClick = useCallback(
    (id) => {
      setIsActive(id);
      const layersUpdate =
        id === 'no-layer'
          ? activeLayers.filter((w) => w.id !== 'hi-res-extent')
          : ([
              ...activeLayers,
              {
                id: 'hi-res-extent' as ContextualBasemapsId,
                opacity: '1',
                visibility: 'visible',
              },
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

        {HIGH_RESOLUTION_EXTENT.map(({ id, name }) => {
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
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};

export default HighResolutionExtentBasemap;
