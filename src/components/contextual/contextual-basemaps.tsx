import { SetStateAction, useCallback, useState, Dispatch } from 'react';

import cn from 'lib/classnames';
import { useSyncLayers } from 'lib/utils/sync-query';
import { useSyncDatasetsSettings } from 'lib/utils/sync-query';

import type { LayersSlugType } from 'types/widgets';

import { CONTEXTUAL_LAYERS_PLANET_SERIES_ATTRIBUTES } from 'containers/datasets/contextual-layers/constants';

import DateSelect from 'components/planet-date-select';
import RadioGroup from 'components/radio-group';
import RadioGroupItem from 'components/radio-group/radio-group-item';

const BasemapsMapSettings = () => {
  const [layers, setActiveLayers] = useSyncLayers();
  const [datasetsSettings, setdatasetsSettings] = useSyncDatasetsSettings();
  // Type for the state, including both LayersSlugType and the 'no-layer' fallback
  type ActiveLayerStateType = LayersSlugType | 'no-layer';

  // Adjusted logic for defaultActive with the correct typing
  const defaultActive: ActiveLayerStateType =
    layers.find((layer) => layer.includes('planet')) || 'no-layer';

  // State definition using the properly typed state
  const [isActive, setIsActive] = useState<ActiveLayerStateType>(defaultActive);
  const handleClick = useCallback(
    async (id: LayersSlugType & 'no-layer') => {
      setIsActive(id);

      const noPlanetLayers = layers.filter((w) => !w.includes('planet_medres'));
      if (id === 'no-layer') {
        // Remove the layer and its settings
        const newSettings = datasetsSettings.filter(
          (setting) => !Object.keys(setting).includes(id)
        );
        await setActiveLayers(noPlanetLayers);
        await setdatasetsSettings(newSettings);
      } else {
        // Add the layer and its default settings
        const newLayers = [id, ...layers];
        const newSetting = {
          [id]: { opacity: '1', visibility: 'visible' },
        };
        // Ensure we merge new settings correctly with existing ones, without duplicating
        const existingSettings = datasetsSettings.some((setting) =>
          Object.keys(setting).includes(id)
        )
          ? datasetsSettings.map((setting) =>
              Object.keys(setting).includes(id) ? { ...setting, ...newSetting } : setting
            )
          : [...datasetsSettings, newSetting];
        await setActiveLayers(newLayers);
        await setdatasetsSettings(existingSettings);
      }
    },
    [layers, setActiveLayers, setdatasetsSettings, datasetsSettings]
  );

  return (
    <div className="relative flex flex-col text-sm text-black/85">
      <RadioGroup onValueChange={void handleClick} defaultValue={defaultActive}>
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
