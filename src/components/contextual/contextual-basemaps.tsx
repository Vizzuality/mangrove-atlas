import { useCallback, useState } from 'react';

import cn from 'lib/classnames';

import { activeLayersAtom } from 'store/layers';

import * as Checkbox from '@radix-ui/react-checkbox';
import { useRecoilState } from 'recoil';

import { CONTEXTUAL_LAYERS_PLANET_SERIES_ATTRIBUTES } from 'containers/datasets/contextual-layers/constants';

import DateSelect from 'components/planet-date-select';
import type { ActiveLayers } from 'types/layers';

const BasemapsMapSettings = () => {
  const [activeLayers, setActiveLayers] = useRecoilState(activeLayersAtom);
  const [planetImageryLayers, setPlanetImageryLayers] = useState<
    | {
        id: 'planet_medres_visual_monthly' | 'planet_medres_analytic_monthly';
        isChecked: boolean;
      }[]
  >([
    {
      id: 'planet_medres_visual_monthly',
      isChecked: false,
    },
    {
      id: 'planet_medres_analytic_monthly',
      isChecked: false,
    },
  ]);

  const handleClick = useCallback(
    (id) => {
      const updatedPlanetImagertLayersList = planetImageryLayers.map((pil) => {
        if (pil.id == id) {
          return { ...pil, isChecked: !pil.isChecked };
        }
        return { ...pil, isChecked: false };
      });

      setPlanetImageryLayers(updatedPlanetImagertLayersList);

      const idToUpdate = planetImageryLayers.find((layer) => layer.isChecked)?.id;
      const isActive = activeLayers.find((layer) => layer.id === idToUpdate);
      const layersUpdate = !!isActive
        ? activeLayers.filter((w) => w.id !== idToUpdate)
        : ([
            {
              id: idToUpdate,
              opacity: '1',
              visibility: 'visible',
            },
            ...activeLayers,
          ] as ActiveLayers[]);
      setActiveLayers(layersUpdate);
    },
    [planetImageryLayers, activeLayers, setActiveLayers]
  );

  return (
    <div className="relative flex flex-col pb-4 font-light text-black/85">
      <>
        {CONTEXTUAL_LAYERS_PLANET_SERIES_ATTRIBUTES.map(({ id, name, mosaic_id }) => {
          return (
            <div key={id} className="ml-0.5 flex flex-col">
              <div className="flex items-center space-x-4 py-1 font-light text-black/85">
                <Checkbox.Root
                  id={id}
                  className={cn({
                    'flex h-3 w-3 shrink-0 items-center justify-center rounded-full border border-black/85':
                      true,
                    'border-4 border-brand-800':
                      id === planetImageryLayers.find((layer) => layer.isChecked)?.id,
                  })}
                  onCheckedChange={() => {
                    handleClick(id);
                  }}
                  data-testid={id}
                />
                <label className="font-sm m-0 text-sm font-semibold text-brand-800" htmlFor={id}>
                  {name}
                </label>
              </div>

              {planetImageryLayers.find((layer) => layer.isChecked)?.id === id && (
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
