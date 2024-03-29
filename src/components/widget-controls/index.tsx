import { useMemo, useCallback } from 'react';

import cn from 'lib/classnames';

import { activeLayersAtom } from 'store/layers';
import { mapSettingsAtom } from 'store/map-settings';
import { locationToolAtom } from 'store/sidebar';

import { useRecoilState, useRecoilValue } from 'recoil';

import { DOWNLOAD, INFO, LAYERS } from 'containers/datasets';
import Helper from 'containers/guide/helper';

import { SwitchWrapper, SwitchRoot, SwitchThumb } from 'components/switch';
import type { ActiveLayers } from 'types/layers';
import type { WidgetSlugType } from 'types/widget';

import Download from './download';
import Info from './info';

type ContentType = {
  info: string;
  download: string;
  layer?: string;
};

type WidgetControlsType = Readonly<{
  id?: WidgetSlugType;
  content?: ContentType;
}>;

const WidgetControls = ({ id, content }: WidgetControlsType) => {
  const isMapSettingsOpen = useRecoilValue(mapSettingsAtom);
  const locationTool = useRecoilValue(locationToolAtom);

  const [activeLayers, setActiveLayers] = useRecoilState(activeLayersAtom);
  const activeLayersIds = activeLayers.map((l) => l.id);
  const isActive = useMemo(() => activeLayersIds.includes(id), [activeLayersIds, id]);

  const download = DOWNLOAD[id] || content?.download;
  const info = INFO[id] || content?.info;
  const layer = LAYERS[id] || content?.layer;

  const handleClick = useCallback(() => {
    const layersUpdate = isActive
      ? activeLayers.filter((w) => w.id !== id)
      : ([{ id, opacity: '1', visibility: 'visible' }, ...activeLayers] as ActiveLayers[]);
    setActiveLayers(layersUpdate);
  }, [isActive, activeLayers, setActiveLayers, id]);

  const HELPER_ID = id === activeLayers[0]?.id;

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
