import { useMemo, useCallback } from 'react';

import cn from 'lib/classnames';
import { useSyncDatasetsSettings, useSyncLayers } from 'lib/utils/sync-query';

import { mapSettingsAtom } from 'store/map-settings';
import { locationToolAtom } from 'store/sidebar';

import { useRecoilValue } from 'recoil';

import { DOWNLOAD, INFO, LAYERS } from 'containers/datasets';
import Helper from 'containers/guide/helper';

import { SwitchWrapper, SwitchRoot, SwitchThumb } from 'components/switch';
import type { LayersSlugType, WidgetSlugType, ContextualBasemapsId } from 'types/widget';

import Download from './download';
import Info from './info';

type ContentType = {
  info: string;
  download: string;
  layer?: string;
};

type WidgetControlsType = Readonly<{
  id?: LayersSlugType & ContextualBasemapsId & WidgetSlugType;
  content?: ContentType;
}>;

const WidgetControls = ({ id, content }: WidgetControlsType) => {
  const isMapSettingsOpen = useRecoilValue(mapSettingsAtom);
  const locationTool = useRecoilValue(locationToolAtom);

  const [layers, setActiveLayers] = useSyncLayers();
  const [datasetsSettings, setDatasetsSettings] = useSyncDatasetsSettings();
  const isActive = useMemo(() => id !== undefined && layers.includes(id), [layers, id]);

  const download = DOWNLOAD[id] || content?.download;
  const info = INFO[id] || content?.info;
  const layer = LAYERS[id] || content?.layer;

  const handleClick = useCallback(async () => {
    if (isActive) {
      // Remove the layer and its settings
      const newLayers = layers.filter((w) => w !== id);
      const newSettings = datasetsSettings.filter((setting) => !Object.keys(setting).includes(id));
      await setActiveLayers(newLayers);
      await setDatasetsSettings(newSettings);
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
      await setDatasetsSettings(existingSettings);
    }
  }, [isActive, layers, datasetsSettings, id, setActiveLayers, setDatasetsSettings]);

  const HELPER_ID = id === layers[0]?.id;

  const showDownloadInfoHelpers =
    !isMapSettingsOpen && HELPER_ID && (locationTool === 'worldwide' || locationTool === 'search');

  return (
    <div
      className={cn({
        'flex items-center space-x-2 print:hidden': true,
      })}
    >
      <Helper
        className={{
          button: showDownloadInfoHelpers ? '-bottom-3.5 -right-1.5' : 'hidden',
          tooltip: 'w-80',
        }}
        tooltipPosition={{ top: -40, left: 0 }}
        message="Click one of these to find background information about a layer/widget, to download data or to toggle a layer on and off on the map"
      >
        <div className="flex items-center space-x-2">
          {!!download && <Download id={id} content={download} />}
          {!!info && <Info id={id} content={info} />}
        </div>
      </Helper>

      {!!layer && (
        <Helper
          className={{
            button: HELPER_ID ? '-bottom-3.5 -right-1.5 z-20' : 'hidden',
            tooltip: 'w-80',
          }}
          theme="dark"
          tooltipPosition={{ top: -40, left: 0 }}
          message="Widgets display information and statistics about a geometry on the map. Most widgets also come with map layer that can be toggled on or off"
        >
          <SwitchWrapper id={id}>
            <SwitchRoot
              data-testid={id}
              onClick={handleClick}
              defaultChecked={isActive}
              checked={isActive}
            >
              <SwitchThumb />
            </SwitchRoot>
          </SwitchWrapper>
        </Helper>
      )}
    </div>
  );
};

export default WidgetControls;
