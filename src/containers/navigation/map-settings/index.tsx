import { useCallback } from 'react';

import cn from '@/lib/classnames';

import { drawingToolAtom } from '@/store/drawing-tool';
import { mapSettingsAtom } from '@/store/map-settings';
import { locationToolAtom } from '@/store/sidebar';

import { useAtom, useSetAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';

import MAP_SETTINGS_SVG from '@/svgs/sidebar/map-settings';

import { STYLES } from '../constants';

const MapSettings = () => {
  const [mapSettings, setMapViewState] = useAtom(mapSettingsAtom);
  const saveLocationTool = useSetAtom(locationToolAtom);

  const resetDrawingToolState = useResetAtom(drawingToolAtom);
  const handleMapSettingsView = useCallback(() => {
    setMapViewState(true);
    resetDrawingToolState();
    saveLocationTool(null);
  }, [resetDrawingToolState, saveLocationTool, setMapViewState]);

  return (
    <div className="flex flex-col space-y-2 text-center">
      <span className="text-xxs font-sans leading-[10px] text-white">Settings</span>
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
          <MAP_SETTINGS_SVG
            className={cn({
              'text-brand-800 h-9 w-9 fill-current p-1': true,
              'text-white': mapSettings,
            })}
            role="img"
            title="Map settings"
          />
        </button>
      </div>
    </div>
  );
};

export default MapSettings;
