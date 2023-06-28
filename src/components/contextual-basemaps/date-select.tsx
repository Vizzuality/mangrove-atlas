import { useMemo, useEffect } from 'react';

import cn from 'lib/classnames';

import { basemapContextualVisualMonthlyDateAtom } from 'store/map-settings';
import { basemapContextualAnalyticMonthlyDateAtom } from 'store/map-settings';

import { useRecoilState } from 'recoil';

import type { BasemapId } from 'containers/datasets/contextual-layers/basemaps';
import { useMosaicsFromSeriesPlanetSatelliteBasemaps } from 'containers/datasets/contextual-layers/basemaps-planet/hooks';

import Icon from 'components/icon';
import {
  Tooltip,
  TooltipContent,
  TooltipArrow,
  TooltipTrigger,
  TooltipPortal,
} from 'components/tooltip';
import type { ContextualBasemapsId, MosaicId } from 'types/widget';

import ARROW_SVG from 'svgs/ui/arrow.svg?sprite';

const DateSelect = ({
  id,
  mosaic_id,
}: {
  id: ContextualBasemapsId | BasemapId;
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

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex w-full cursor-pointer items-center justify-between rounded-3xl border-2 border-brand-800 border-opacity-50 py-1 px-4">
          <p className="first-line:after">
            Period: <span className="text-sm font-bold">{selectedDate.label}</span>
          </p>
          <Icon
            icon={ARROW_SVG}
            className={cn({
              '[data-state=closed]:rotate-180 relative inline-block h-1.5 w-2.5 font-bold': true,
            })}
          />
        </div>
      </TooltipTrigger>

      <TooltipPortal>
        <TooltipContent
          side="top"
          align="center"
          className="rounded-3xl bg-white p-4 text-black/85 shadow-soft"
        >
          <ul className={cn({ 'max-h-56 space-y-2 overflow-y-auto scrollbar-hide': true })}>
            {dates?.map((d) => (
              <li key={d.value}>
                <button
                  className={cn({
                    'font-bold': true,
                    'hover:text-brand-800': true,
                  })}
                  type="button"
                  onClick={() => setDate(d)}
                >
                  {d.label}
                </button>
              </li>
            ))}
          </ul>

          <TooltipArrow className=" fill-white" width={10} height={5} />
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
};

export default DateSelect;
