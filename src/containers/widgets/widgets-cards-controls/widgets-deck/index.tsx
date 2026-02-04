import { FC } from 'react';

import { useRouter } from 'next/router';

import cn from '@/lib/classnames';

import { activeWidgetsAtom } from '@/store/widgets';

import { useRecoilState } from 'recoil';

import Category from '@/containers/categories-menu';
import { LocationTypes } from '@/containers/datasets/locations/types';
import Helper from '@/containers/help/helper';
import { widgets } from '@/containers/widgets/constants';
import WidgetsMenu from '@/containers/widgets/widgets-menu';

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle,
} from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

import ALERT_SVG from '@/svgs/ui/alert.svg?sprite';

const HELPER_ID = 'menu-categories';
const WidgetsDeck: FC = () => {
  const {
    query: { params },
  } = useRouter();

  // Params as default don't appear in URL, when there is no location we assume worldwide
  const locationType = (params?.[0] || 'worldwide') as LocationTypes;

  const [activeWidgets] = useRecoilState(activeWidgetsAtom);

  const activeWidgetsFilteredByLocationType = widgets
    .filter((w) => w.locationType?.includes(locationType))
    .map(({ slug }) => slug);

  const filteredWidgetsToDisplay = activeWidgetsFilteredByLocationType.filter(
    (element) => activeWidgets.includes(element) && element !== 'widgets_deck_tool'
  );

  return (
    <Dialog>
      <Helper
        className={{
          button: '-top-1.5 right-0 z-20',
          tooltip: 'w-fit-content max-w-[400px]',
        }}
        tooltipPosition={{ top: -50, left: 0 }}
        message="Opens deck to select which widgets and map layers are displayed on the left side of the screen. Widgets provide information and statistics about a selected geography, protected area, or user-inputted polygon. Most widgets also come with a map layer that can be toggled on and off. Users can select groups of widgets organized by theme or customize their own combination of widgets and map layers. Some layers and widgets are not available for certain locations. Select applicable geography to enable layer."
      >
        <DialogTrigger asChild>
          <button
            type="button"
            data-testid="widgets-deck-trigger"
            className={cn({
              'text-brand-800 shadow-control ml-1 flex h-8 w-full items-center justify-center rounded-4xl bg-white px-10 py-1 font-sans text-sm font-semibold transition-colors md:ml-0 md:w-[262px] print:hidden':
                true,
            })}
          >
            <p>
              Widgets deck <span>({filteredWidgetsToDisplay.length})</span>
            </p>
          </button>
        </DialogTrigger>
      </Helper>
      <DialogContent className="mb-10 w-screen border-2 md:w-auto">
        <DialogClose className="top-8 md:fixed md:!top-18 md:left-[595px]" />
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
            message="Opens deck to select which widgets and map layers are displayed on the left side of the screen. Widgets provide information and statistics about a selected geography, protected area, or user-inputted polygon. Most widgets also come with a map layer that can be toggled on and off. Users can select groups of widgets organized by theme or customize their own combination of widgets and map layers. Some layers and widgets are not available for certain locations. Select applicable geography to enable layer."
          >
            <Category />
          </Helper>
          <div className="shadow-control flex w-full items-center space-x-4 rounded-3xl bg-gray-50 p-2.5">
            <Icon
              icon={ALERT_SVG}
              className="h-16 w-16 fill-current text-white"
              description="alert"
            />
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
    </Dialog>
  );
};

export default WidgetsDeck;
