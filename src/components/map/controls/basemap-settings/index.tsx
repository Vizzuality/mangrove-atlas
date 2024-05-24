import cn from 'lib/classnames';

import Helper from 'containers/guide/helper';

import Basemaps from 'components/contextual/basemaps';
import BasemapsContextualMapSettings from 'components/contextual/contextual-basemaps';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from 'components/ui/dialog';
import Icon from 'components/ui/icon';

import BASEMAP_SETTINGS_SVG from 'svgs/map/basemap-settings.svg?sprite';

export const BasemapSettings = ({ className }: { className?: string }) => {
  return (
    <Dialog>
      <DialogTrigger>
        <div
          className={cn({
            'group inline-flex h-12 w-12 cursor-pointer flex-col items-center justify-center rounded-full bg-white shadow-control backdrop-blur-sm backdrop-filter hover:bg-gray-100 disabled:cursor-default disabled:bg-gray-50 disabled:outline-none':
              true,
            [className]: !!className,
          })}
        >
          <Icon
            icon={BASEMAP_SETTINGS_SVG}
            className="h-4 w-4 bg-white group-hover:bg-gray-100 group-disabled:fill-grey-75"
            description="Basemap settings"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="top-52">
        <div className="no-scrollbar space-y-6">
          <h2 className="font-black/85 text-3xl font-light leading-10">Basemap settings</h2>
          <Helper
            className={{
              button: 'top-4 left-[308px] z-[20]',
              tooltip: 'w-fit-content',
              container: 'space-y-2',
            }}
            tooltipPosition={{ top: -140, left: 0 }}
            message="use these buttons to switch between basemaps"
          >
            <div className="flex w-[490px] flex-col space-y-2">
              <p className="text-xs font-bold uppercase tracking-[1px]">map style</p>
              <Basemaps />
            </div>
          </Helper>
          <Helper
            className={{
              button: '-top-2 left-32 z-[20]',
              tooltip: 'w-fit-content',
              container: 'space-y-2',
            }}
            tooltipPosition={{ top: -80, left: 0 }}
            message="Chose between different planet imagery layers and dates"
          >
            <p className="text-xs font-semibold uppercase tracking-[1px]">planet imagery</p>

            <BasemapsContextualMapSettings />
          </Helper>
        </div>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
};

export default BasemapSettings;
