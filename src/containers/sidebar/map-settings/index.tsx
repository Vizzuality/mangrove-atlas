import { useCallback } from 'react';

import cn from 'lib/classnames';

import { mapSettingsAtom } from 'store/map-settings';

import { useRecoilState } from 'recoil';

import Icon from 'components/icon';

import MAP_SETTINGS_SVG from 'svgs/sidebar/map-settings.svg?sprite';

import { STYLES } from '../constants';

const MapSettings = () => {
  const [mapSettings, setMapViewState] = useRecoilState(mapSettingsAtom);

  const handleMapSettingsView = useCallback(async () => {
    setMapViewState(true);
  }, []);

  return (
    <div className="flex flex-col space-y-2 text-center">
      <span className="font-sans text-xxs leading-[10px] text-white">Settings</span>
      <div className={`${STYLES['icon-wrapper']} space-y-4 rounded-full bg-white py-1`}>
        <button
          type="button"
          className={cn({
            'flex cursor-pointer items-center justify-center rounded-full': true,
            'bg-brand-800': mapSettings,
          })}
          onClick={handleMapSettingsView}
        >
          <Icon
            icon={MAP_SETTINGS_SVG}
            className={cn({
              'h-8 w-8 fill-current text-brand-800': true,
              'text-white': mapSettings,
            })}
          />
        </button>
      </div>
    </div>
  );
};

export default MapSettings;
