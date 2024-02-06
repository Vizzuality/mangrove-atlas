import { ReactElement, useMemo, useCallback } from 'react';

import Image from 'next/image';

import { useSyncLayers, useSyncDatasetsSettings } from 'lib/utils/sync-query';

import { SwitchWrapper, SwitchRoot, SwitchThumb } from 'components/switch';
import type { ActiveLayers } from 'types/layers';
import type { ContextualBasemapsId, LayersSlugType, WidgetSlugType } from 'types/widget';
type SuggestionTypes = {
  name: string;
  id: LayersSlugType & ContextualBasemapsId & WidgetSlugType;
  description: string;
  children?: ReactElement;
  color?: string;
  thumbSource?: string;
};

const SuggestedLayers = ({
  children,
  name,
  id,
  description,
  color,
  thumbSource,
}: SuggestionTypes) => {
  const [layers, setActiveLayers] = useSyncLayers();
  const [datasetsSettings, setdatasetsSettings] = useSyncDatasetsSettings();

  const isActive = useMemo(() => layers.includes(id), [layers, id]);

  const handleClick = useCallback(async () => {
    if (isActive) {
      // Remove the layer and its settings
      const newLayers = layers.filter((w) => w !== id);
      const newSettings = datasetsSettings.filter((setting) => !Object.keys(setting).includes(id));
      await setActiveLayers(newLayers);
      await setdatasetsSettings(newSettings);
    } else {
      // Add the layer and its default settings
      const newLayers = [id, ...layers];
      const newSetting = {
        [id]: { opacity: '1', visibility: 'visible' },
      };
      // Ensure we merge new settings correctly with existing ones, without duplicating
      const existingSettings = datasetsSettings.some((setting) => Object.keys(setting).includes(id))
        ? datasetsSettings.map((setting) =>
            Object.keys(setting).includes(id) ? { ...setting, ...newSetting } : setting
          )
        : [...datasetsSettings, newSetting];
      await setActiveLayers(newLayers);
      await setdatasetsSettings(existingSettings);
    }
  }, [isActive, layers, setdatasetsSettings, setActiveLayers, datasetsSettings, id]);

  // const handleClick = () => {
  //   const updatedContextualBasemap = basemapContextualSelected === id ? null : id;
  //   setBasemapContextual({ id: updatedContextualBasemap, opacity: 1, visibility: 'visible' });
  // };

  return (
    <div className="flex flex-col space-y-4 rounded-xl bg-black bg-opacity-[4%] p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {!!thumbSource && (
            <div className="relative h-[42px] w-[42px] shrink-0 rounded-2xl">
              <Image
                fill={true}
                quality={100}
                style={{ objectFit: 'contain' }}
                className="rounded-xl"
                src={thumbSource}
                alt={name}
              />
            </div>
          )}
          {color && (
            <div className="h-[42px] w-[42px] rounded-2xl" style={{ backgroundColor: color }} />
          )}
          <p className="text-sm">{description}</p>
        </div>
        <div className="flex items-start space-x-2">
          <SwitchWrapper id={id}>
            <SwitchRoot onClick={handleClick} defaultChecked={isActive} checked={isActive}>
              <SwitchThumb />
            </SwitchRoot>
          </SwitchWrapper>
        </div>
      </div>
      {children && <div>{children}</div>}
    </div>
  );
};

export default SuggestedLayers;
