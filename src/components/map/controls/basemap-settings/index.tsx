import { useState, useCallback } from 'react';
import cn from 'lib/classnames';

import Helper from 'containers/guide/helper';

import Basemaps from 'components/contextual/basemaps';
import BasemapsContextualMapSettings from 'components/contextual/contextual-basemaps';
import HighResolutionExtentBasemap from 'components/contextual/hi-res-extent-basemap';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from 'components/ui/dialog';
import Icon from 'components/ui/icon';
import { Tooltip, TooltipContent, TooltipTrigger } from 'components/ui/tooltip';

import BASEMAP_SETTINGS_SVG from 'svgs/map/basemap-settings.svg?sprite';
import INFO_SVG from 'svgs/ui/info.svg?sprite';

export const BasemapSettings = ({ className }: { className?: string }) => {
  const [infoVisibility, setInfoVisibility] = useState(false);
  const handleInfoVisibility = useCallback(() => {
    setInfoVisibility((prev) => !prev);
  }, []);
  return (
    <Tooltip>
      <TooltipTrigger>
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
                <p className="text-xs font-semibold uppercase tracking-[1px]">
                  High-resolution Mangrove extent
                </p>

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
                <div className="flex items-center space-x-2">
                  <p className="text-xs font-semibold uppercase tracking-[1px]">planet imagery</p>
                  <button onClick={handleInfoVisibility}>
                    <Icon icon={INFO_SVG} className="h-5 w-5 text-brand-800" description="Info" />
                  </button>
                </div>
                {infoVisibility && (
                  <div className="space-y-2 text-xs font-light">
                    <p>
                      To properly reference Planet-NICFI program, we need to add some information
                      and a link. I suggest to do this by adding an info button to the widget, which
                      could then contain the following text:
                    </p>
                    <p>
                      <span className="font-bold">Overview</span> Through Norway’s International
                      Climate & Forests Initiative (NICFI), users can now access Planet’s
                      high-resolution, analysis-ready mosaics of the world’s tropics in order to
                      help reduce and reverse the loss of tropical forests, combat climate change,
                      conserve biodiversity, and facilitate sustainable development for non
                      commercial uses.
                    </p>
                    <p>
                      <span className="font-bold">Date of content</span> 2015 - present{' '}
                    </p>
                    <p>
                      <span className="font-bold">License</span>
                      Planet-NICFI Participant License Agreement
                    </p>
                  </div>
                )}

                <BasemapsContextualMapSettings />
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
