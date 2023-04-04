import { useState } from 'react';

import cn from 'lib/classnames';

import { AccordionTrigger } from '@radix-ui/react-accordion';
import { PopoverArrow } from '@radix-ui/react-popover';

// import { Dialog, DialogContent, DialogTrigger } from 'components/dialog';
import { LegendItemToolbarProps } from 'components/map/legend/types';
// import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
// import Slider from 'components/ui/slider';
// import { Tooltip, TooltipArrow, TooltipContent, TooltipTrigger } from 'components/tooltip';

import EXPAND_SVG from 'svgs/legend/expand.svg?sprite';
import HIDDEN_SVG from 'svgs/legend/hidden.svg?sprite';
import OPACITY_SVG from 'svgs/legend/opacity.svg?sprite';
import VISIBLE_SVG from 'svgs/legend/visible.svg?sprite';
import INFO_SVG from 'svgs/ui/info.svg?sprite';

import LegendItemButton from './button';

export const LegendItemToolbar: React.FC<LegendItemToolbarProps> = ({
  Components,
  settings,
  settingsManager,
  onChangeOpacity,
  onChangeVisibility,
  onChangeExpand,
}: LegendItemToolbarProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { opacity = 1, visibility = true, expand = true } = settings || {};

  return (
    <div className="mt-0.5 flex divide-x">
      <div className="flex space-x-1 pr-2">
        {/* {settingsManager?.opacity && (
          <div className="flex items-start">
            <Popover
              onOpenChange={(open) => {
                setPopoverOpen(open);
              }}
            >
              <Tooltip delayDuration={500}>
                <PopoverTrigger asChild>
                  <TooltipTrigger
                    type="button"
                    className={cn({
                      'pointer-events-none': popoverOpen,
                    })}
                  >
                    <LegendItemButton icon={OPACITY_SVG} selected={opacity !== 1} />
                  </TooltipTrigger>
                </PopoverTrigger> 

                <TooltipContent
                  align="end"
                  alignOffset={-10}
                  className="border-navy-500 bg-navy-500 rounded-none"
                >
                  <div className="text-xxs text-white">Opacity</div>

                  <TooltipArrow className="fill-navy-500" width={10} height={5} />
                </TooltipContent>
              </Tooltip>

              <PopoverContent
                side="top"
                align="end"
                alignOffset={-10}
                className="border-navy-500 bg-navy-500 max-w-[122px] px-2.5 pt-1 pb-2.5"
              >
                <div className="space-y-5">
                  <div className="text-xxs text-white">Opacity</div>

                   <Slider
                    className="w-full"
                    defaultValue={[opacity]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={(value) => {
                      if (onChangeOpacity) onChangeOpacity(value[0]);
                    }}
                  /> 
                </div>
                <PopoverArrow className="fill-navy-500 block" width={11} height={5} />
              </PopoverContent>
            </Popover>
          </div>
        )}

        {settingsManager?.visibility && (
          <div className="flex items-start">
            <Tooltip delayDuration={500}>
              <TooltipTrigger
                type="button"
                className={cn({
                  'pointer-events-none': popoverOpen,
                })}
                onClick={() => {
                  if (onChangeVisibility) onChangeVisibility(!visibility);
                }}
              >
                <LegendItemButton icon={visibility ? VISIBLE_SVG : HIDDEN_SVG} />
              </TooltipTrigger>

              <TooltipContent
                side="top"
                align="end"
                alignOffset={-10}
                className="border-navy-500 bg-navy-500 rounded-none"
              >
                <div className="text-xxs text-white">
                  {visibility ? 'Hide layer' : 'Show layer'}
                </div>

                <TooltipArrow className="fill-navy-500" width={10} height={5} />
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        {settingsManager?.info && (
          <div className="flex items-start">
            <Dialog>
              <Tooltip delayDuration={500}>
                <DialogTrigger asChild>
                  <TooltipTrigger
                    type="button"
                    className={cn({
                      'pointer-events-none': popoverOpen,
                    })}
                  >
                    <LegendItemButton icon={INFO_SVG} />
                  </TooltipTrigger>
                </DialogTrigger>

                <TooltipContent
                  side="top"
                  align="end"
                  alignOffset={-10}
                  className="border-navy-500 bg-navy-500 rounded-none"
                >
                  <div className="text-xxs text-white">Show info</div>

                  <TooltipArrow className="fill-navy-500" width={10} height={5} />
                </TooltipContent>

                <DialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
                  {Components.Info}
                </DialogContent>
              </Tooltip>
            </Dialog>
          </div>
        )} */}
      </div>

      {/* <div className="pl-2">
        {settingsManager?.expand && (
          <div className="flex items-start">
            <Tooltip delayDuration={500}>
              <AccordionTrigger asChild>
                <TooltipTrigger
                  type="button"
                  className={cn({
                    'pointer-events-none': popoverOpen,
                  })}
                  onClick={() => {
                    if (onChangeExpand) onChangeExpand(!expand);
                  }}
                >
                  <LegendItemButton
                    icon={EXPAND_SVG}
                    className={cn({
                      'rotate-180': !expand,
                      'rotate-0 transform transition-transform': expand,
                    })}
                  />
                </TooltipTrigger>
              </AccordionTrigger>

              <TooltipContent
                side="top"
                align="end"
                alignOffset={-10}
                className="border-navy-500 bg-navy-500 rounded-none"
              >
                <div className="text-xxs text-white">
                  {expand ? 'Collapse layer' : 'Expand layer'}
                </div>

                <TooltipArrow className="fill-navy-500" width={10} height={5} />
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div> */}
    </div>
  );
};

export default LegendItemToolbar;
