import { useMemo, useEffect } from 'react';

import cn from 'lib/classnames';

import { basemapContextualVisualMonthlyDateAtom } from 'store/map-settings';
import { basemapContextualAnalyticMonthlyDateAtom } from 'store/map-settings';

import { orderBy } from 'lodash-es';
import { useRecoilState } from 'recoil';

import type { BasemapId } from 'containers/datasets/contextual-layers/basemaps';
import { useMosaicsFromSeriesPlanetSatelliteBasemaps } from 'containers/datasets/contextual-layers/basemaps-planet/hooks';

import Icon from 'components/icon';
import { Popover, PopoverContent, PopoverTrigger } from 'components/popover';
import type { ContextualBasemapsId, MosaicId, WidgetSlugType } from 'types/widget';

import ARROW_SVG from 'svgs/ui/arrow.svg?sprite';

const DateSelect = ({
  id,
  mosaic_id,
}: {
  id: ContextualBasemapsId | BasemapId | WidgetSlugType;
  mosaic_id: MosaicId;
}) => {
  const { data: dates } = useMosaicsFromSeriesPlanetSatelliteBasemaps(mosaic_id);
  const datesState =
    id === 'planet_medres_visual_monthly'
      ? basemapContextualVisualMonthlyDateAtom
      : basemapContextualAnalyticMonthlyDateAtom;
  const [date, setDate] = useRecoilState(datesState);
  const selectedDate = useMemo(() => date || dates?.[dates.length - 1], [date]);

  useEffect(() => {
    if (!date?.value) {
      setDate(dates?.[dates?.length - 1]);
    }
  }, [dates]);

  const orderedDates = useMemo(() => orderBy(dates, ['value'], ['desc']), [dates]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex w-full cursor-pointer items-center justify-between rounded-3xl border-2 border-brand-800 border-opacity-50 py-1 px-4">
          <p className="first-line:after">
            Period: <span className="text-sm font-bold">{selectedDate?.label}</span>
          </p>
          <Icon
            icon={ARROW_SVG}
            className={cn({
              '[data-state=closed]:rotate-180 relative inline-block h-1.5 w-2.5 font-bold': true,
            })}
          />
        </div>
      </PopoverTrigger>

      <PopoverContent>
        <ul className="max-h-56 space-y-2">
          {orderedDates?.map((d) => (
            <li key={d.value} className="whitespace-nowrap last-of-type:pb-4">
              <button
                className="font-bold hover:text-brand-800"
                type="button"
                onClick={() => setDate(d)}
              >
                {d.label}
              </button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default DateSelect;
