import { useMemo, useCallback } from 'react';

import cn from 'lib/classnames';

import { activeLayersAtom } from 'store/layers';
import { mapSettingsAtom } from 'store/map-settings';
import { locationToolAtom } from 'store/sidebar';

import { useRecoilState, useRecoilValue } from 'recoil';

import { updateLayers } from 'hooks/layers';

import { DOWNLOAD, INFO, LAYERS } from 'containers/datasets';
import Helper from 'containers/guide/helper';

import { SwitchWrapper, SwitchRoot, SwitchThumb } from 'components/ui/switch';
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
  const activeLayersIds = activeLayers?.map((l) => l.id);

  const isActive = useMemo(() => {
    // Check if the id is included in activeLayersIds
    const isCurrentlyActive = activeLayersIds?.includes(id);

    // Check if any id in activeLayersIds starts with 'national_dashboard'
    const isAnyActiveNationalDashboard =
      id?.startsWith('mangrove_national_dashboard') &&
      activeLayersIds.some((layerId) => layerId.startsWith('mangrove_national_dashboard'));

    // Returns true if the current id is 'national_dashboard' and it is active,
    // or if the id is not 'national_dashboard' but some id in activeLayersIds is
    return isCurrentlyActive || isAnyActiveNationalDashboard;
  }, [activeLayersIds, id]);

  const download = DOWNLOAD[id] || content?.download;
  const info = INFO[id] || content?.info;
  const layer = LAYERS[id] || content?.layer;

  const handleClick = useCallback(() => {
    const layersUpdate = updateLayers(activeLayers, {
      id,
      opacity: '1',
      visibility: isActive ? 'none' : 'visible',
    });
    setActiveLayers(layersUpdate);
  }, [isActive, activeLayers, setActiveLayers, id]);

  const HELPER_ID = id === activeLayers?.[0]?.id;

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
