import { FC } from 'react';

import cn from '@/lib/classnames';

import { locationTypeAtom } from '@/store/locations';
import { useSyncActiveWidgets } from '@/store/widgets';

import { useAtomValue } from 'jotai';

import { LocationTypes } from '@/containers/datasets/locations/types';
import Helper from '@/containers/help/helper';
import { widgets } from '@/containers/widgets/constants';
import WidgetsDeckContent from '@/containers/widgets/widgets-deck/content';

import { Dialog, DialogTrigger } from '@/components/ui/dialog';

const WidgetsDeck: FC = () => {
  // Params as default don't appear in URL, when there is no location we assume worldwide
  const locationType = (useAtomValue(locationTypeAtom) || 'worldwide') as LocationTypes;

  const [activeWidgets] = useSyncActiveWidgets();

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
      <WidgetsDeckContent />
    </Dialog>
  );
};

export default WidgetsDeck;
