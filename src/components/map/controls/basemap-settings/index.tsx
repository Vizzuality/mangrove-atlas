import cn from 'lib/classnames';

import Icon from 'components/icon';

import BASEMAP_SETTINGS_SVG from 'svgs/map/basemap-settings.svg?sprite';

export const BasemapSettings = ({ className }: { className?: string }) => {
  return (
    <button
      className={cn({
        'group flex inline-flex h-11 w-11 flex-col items-center justify-center rounded-full border bg-white shadow-control hover:bg-gray-100 disabled:cursor-default disabled:bg-gray-50 disabled:outline-none':
          true,
        [className]: !!className,
      })}
      onClick={() => console.info('basemap settings')}
    >
      <Icon
        icon={BASEMAP_SETTINGS_SVG}
        className="h-5 w-5 bg-white group-hover:bg-gray-100 group-disabled:fill-grey-75"
        description="Basemap settings"
      />
    </button>
  );
};

export default BasemapSettings;
