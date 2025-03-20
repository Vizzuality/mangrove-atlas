import { FC } from 'react';

import { useRouter } from 'next/router';

import cn from 'lib/classnames';

import { activeWidgetsAtom } from 'store/widgets';

import { useRecoilState } from 'recoil';

import Category from 'containers/categories-menu';
import { LocationTypes } from 'containers/datasets/locations/types';
import Helper from 'containers/help/helper';
import { widgets } from 'containers/widgets/constants';
import WidgetsMenu from 'containers/widgets/widgets-menu';

import { Dialog, DialogContent, DialogTrigger, DialogClose } from 'components/ui/dialog';
import Icon from 'components/ui/icon';

import ALERT_SVG from 'svgs/ui/alert.svg?sprite';

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
          button: 'right-0 -top-1.5 z-20',
          tooltip: 'w-fit-content',
        }}
        tooltipPosition={{ top: -50, left: 0 }}
        message="Triggers deck to configure widgets"
      >
        <DialogTrigger asChild>
          <button
            type="button"
            data-testid="widgets-deck-trigger"
            className={cn({
              'ml-1 flex h-8 w-full items-center justify-center rounded-4xl bg-white py-1 px-10 font-sans text-sm font-semibold text-brand-800 shadow-control transition-colors print:hidden md:ml-0 md:w-[262px]':
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
          <h2 className="font-black/85 text-3xl font-light leading-10">Widgets deck settings</h2>
          <Helper
            className={{
              button: HELPER_ID ? '-bottom-9 right-40 z-20' : 'hidden',
              tooltip: 'w-80',
            }}
            tooltipPosition={{ top: -20, left: 0 }}
            message="Widgets display information and statistics about a geometry on the map. Most widgets also come with map layer that can be toggled on or off"
          >
            <Category />
          </Helper>
          <div className="flex w-full items-center space-x-4 rounded-3xl bg-gray-50 p-2.5 shadow-control">
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
