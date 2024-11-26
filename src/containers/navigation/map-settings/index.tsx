import { useCallback } from 'react';

import cn from 'lib/classnames';

import { drawingToolAtom } from 'store/drawing-tool';
import { mapSettingsAtom } from 'store/map-settings';
import { locationToolAtom } from 'store/sidebar';

import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';

import Icon from 'components/ui/icon';

import MAP_SETTINGS_SVG from 'svgs/sidebar/map-settings.svg?sprite';

import { STYLES } from '../constants';

const MapSettings = () => {
  const [mapSettings, setMapViewState] = useRecoilState(mapSettingsAtom);
  const saveLocationTool = useSetRecoilState(locationToolAtom);

  const resetDrawingToolState = useResetRecoilState(drawingToolAtom);
  const handleMapSettingsView = useCallback(() => {
    setMapViewState(true);
    resetDrawingToolState();
    saveLocationTool(null);
  }, [resetDrawingToolState, saveLocationTool, setMapViewState]);

  return (
    <div className="flex flex-col space-y-2 text-center">
      <span className="font-sans text-xxs leading-[10px] text-white">Settings</span>
      <div className={`${STYLES['icon-wrapper']} space-y-4 rounded-full bg-white py-1`}>
        <button
          type="button"
          className={cn({
            'flex items-center justify-center rounded-full': true,
            'bg-brand-800': mapSettings,
          })}
          onClick={handleMapSettingsView}
          data-testid="map-settings-button"
        >
          <Icon
            icon={MAP_SETTINGS_SVG}
            className={cn({
              'h-9 w-9 fill-current p-1 text-brand-800': true,
              'text-white': mapSettings,
            })}
            description="Map settings"
          />
        </button>
      </div>
    </div>
  );
};

export default MapSettings;
