import { FC } from 'react';

import cn from '@/lib/classnames';

import Category from '@/containers/categories-menu';
import Helper from '@/containers/help/helper';
import WidgetsMenu from '@/containers/widgets/widgets-menu';

import { DialogContent, DialogClose, DialogTitle } from '@/components/ui/dialog';

import ALERT_SVG from '@/svgs/ui/alert';

const HELPER_ID = 'menu-categories';

const WidgetsDeckContent: FC = () => {
  return (
    <DialogContent
      className={cn({
        'absolute top-0 left-0 min-h-screen w-screen sm:mb-10 sm:border-2 md:top-4 md:left-4 md:w-auto':
          true,
      })}
    >
      <DialogClose className="top-5 right-5 md:absolute md:top-18! md:-right-10" />
      <div className="no-scrollbar space-y-8">
        <DialogTitle className="font-black/85 text-3xl leading-10 font-light">
          Widgets deck settings
        </DialogTitle>
        <Helper
          className={{
            button: HELPER_ID ? 'right-40 -bottom-9 z-20' : 'hidden',
            tooltip: 'w-80',
          }}
          tooltipPosition={{ top: -20, left: 0 }}
          message="Opens deck to select which widgets and map layers are displayed on the left side of the screen. 
Widgets provide information and statistics about a selected geography, protected area, or user-inputted polygon. Most 
widgets also come with a map layer that can be toggled on and off. Users can select groups of widgets organized by the
me or customize their own combination of widgets and map layers. Some layers and widgets are not available for certain
 locations. Select applicable geography to enable layer."
        >
          <Category />
        </Helper>
        <div className="shadow-control flex w-full items-center space-x-4 rounded-3xl bg-gray-50 p-2.5">
          <ALERT_SVG className="h-16 w-16 fill-current text-white" role="img" title="alert" />
          <p className="text-sm font-light text-black/85">
            Disclaimer: Some layers and widgets are not available for certain locations. Select
            applicable geography to enable layer.
          </p>
        </div>
        <Helper
          className={{
            button: HELPER_ID ? 'right-72 -bottom-4 z-20' : 'hidden',
            tooltip: 'w-fit-content',
          }}
          tooltipPosition={{ top: -70, left: -400 }}
          message="Widgets list"
        >
          <WidgetsMenu />
        </Helper>
      </div>
    </DialogContent>
  );
};

export default WidgetsDeckContent;
