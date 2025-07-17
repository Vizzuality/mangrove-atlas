import cn from 'lib/classnames';

import InfoHiRes from 'containers/datasets/contextual-layers/hi-res-extent/info.mdx';
import Info from 'containers/datasets/contextual-layers/planet/info.mdx';
import Helper from 'containers/help/helper';

import Basemaps from 'components/contextual/basemaps';
import BasemapsContextualMapSettings from 'components/contextual/contextual-basemaps';
import HighResolutionExtentBasemap from 'components/contextual/hi-res-extent-basemap';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from 'components/ui/dialog';
import Icon from 'components/ui/icon';
import { Tooltip, TooltipContent, TooltipTrigger } from 'components/ui/tooltip';

import BASEMAP_SETTINGS_SVG from 'svgs/map/basemap-settings.svg?sprite';
import INFO_SVG from 'svgs/ui/info.svg?sprite';

export const BasemapSettings = ({ className }: { className?: string }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
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
                <>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs font-semibold uppercase tracking-[1px]">
                      High-resolution Mangrove extent
                    </p>
                    <Dialog>
                      <DialogTrigger>
                        <Icon
                          icon={INFO_SVG}
                          className="h-5 w-5 text-brand-800"
                          description="Info"
                        />
                      </DialogTrigger>
                      <DialogContent className="w-screen md:mb-20 md:w-auto">
                        <div className="no-scrollbar overflow-y-auto">
                          <InfoHiRes />
                        </div>
                        <DialogClose className="md:0 -top-2 md:absolute" />
                      </DialogContent>
                    </Dialog>
                  </div>
                </>
                <HighResolutionExtentBasemap />
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
                <>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs font-semibold uppercase tracking-[1px]">planet imagery</p>
                    <Dialog>
                      <DialogTrigger>
                        <Icon
                          icon={INFO_SVG}
                          className="h-5 w-5 text-brand-800"
                          description="Info"
                        />
                      </DialogTrigger>
                      <DialogContent className="w-screen md:mb-20 md:w-auto">
                        <div className="no-scrollbar overflow-y-auto">
                          <Info />
                        </div>
                        <DialogClose className="md:0 -top-2 md:absolute" />
                      </DialogContent>
                    </Dialog>
                  </div>

                  <BasemapsContextualMapSettings />
                </>
              </Helper>
            </div>
            <DialogClose />
          </DialogContent>
        </Dialog>
      </TooltipTrigger>
      <TooltipContent side="left" align="start" className="bg-gray-600 px-2 text-white">
        Basemap settings
      </TooltipContent>
    </Tooltip>
  );
};

export default BasemapSettings;
