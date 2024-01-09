import { useMemo, useCallback } from 'react';

import cn from 'lib/classnames';

import { activeLayersAtom } from 'store/layers';

import { set } from 'date-fns';
import { orderBy } from 'lodash-es';
import { useRecoilState } from 'recoil';

import type { BasemapId } from 'containers/datasets/contextual-layers/basemaps';
import { useMosaicsFromSeriesPlanetSatelliteBasemaps } from 'containers/datasets/contextual-layers/basemaps-planet/hooks';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/dropdown';
import Icon from 'components/icon';
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
  const [activeLayers, setActiveLayers] = useRecoilState(activeLayersAtom);
  const layerUpdate = activeLayers.find((l) => l.id === id);
  console.log(activeLayers, id, layerUpdate);
  const selectedDate = useMemo(
    () => layerUpdate?.settings?.date || dates?.[dates.length - 1]?.value,
    [dates, layerUpdate]
  );

  const labelToDisplay = useMemo(
    () => dates?.find((d) => d.value === selectedDate)?.label,
    [dates, selectedDate]
  );

  const handleDate = useCallback(
    (e) => {
      const filteredLayers = activeLayers.filter((l) => l.id !== id);
      setActiveLayers([
        {
          ...layerUpdate,
          id,
          settings: {
            ...layerUpdate.settings,
            date: e.currentTarget.value,
          },
        },
        ...filteredLayers,
      ]);
    },
    [layerUpdate, activeLayers, id, setActiveLayers]
  );

  const orderedDates = useMemo(() => orderBy(dates, ['value'], ['desc']), [dates]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex w-full cursor-pointer items-center justify-between rounded-3xl border-2 border-brand-800 border-opacity-50 py-1 px-4">
          <p className="first-line:after">
            Period: <span className="text-sm font-bold">{labelToDisplay}</span>
          </p>
          <Icon
            icon={ARROW_SVG}
            className={cn({
              '[data-state=closed]:rotate-180 relative inline-block h-1.5 w-2.5 font-bold': true,
            })}
            description="Arrow"
          />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="max-h-56 space-y-2">
        {orderedDates?.map((d) => (
          <DropdownMenuItem key={d.value} className="whitespace-nowrap last-of-type:pb-4">
            <button
              id={d.label}
              value={d.value}
              className="font-bold hover:text-brand-800"
              type="button"
              role="button"
              onClick={handleDate}
              aria-label={`Select date ${d.label}`}
            >
              {d.label}
            </button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DateSelect;
