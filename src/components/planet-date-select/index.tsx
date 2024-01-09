import { useMemo, useCallback } from 'react';

import cn from 'lib/classnames';

import { activeLayersAtom } from 'store/layers';

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
  className = { content: '' },
}: {
  id: ContextualBasemapsId | BasemapId | WidgetSlugType;
  mosaic_id: MosaicId;
  className?: { content: string };
}) => {
  const { data: dates } = useMosaicsFromSeriesPlanetSatelliteBasemaps(mosaic_id);
  const [activeLayers, setActiveLayers] = useRecoilState(activeLayersAtom);
  const layerToUpdate = useMemo(
    () => activeLayers.find(({ id }) => id === 'planet_medres_visual_monthly'),
    [activeLayers]
  );

  const selectedDate = useMemo(
    () => layerToUpdate?.settings?.date || dates?.[dates.length - 1]?.value,
    [dates, layerToUpdate]
  );

  const labelToDisplay = useMemo(
    () => dates?.find((d) => d.value === selectedDate)?.label,
    [dates, selectedDate]
  );

  const handleDate = useCallback(
    (e) => {
      const filteredLayers = activeLayers.filter((l) => l.id !== id);
      if (!!layerToUpdate) {
        setActiveLayers([
          {
            ...layerToUpdate,
            id,
            settings: {
              ...layerToUpdate.settings,
              date: e.currentTarget.value,
            },
          },
          ...filteredLayers,
        ]);
      }
    },
    [layerToUpdate, activeLayers, id, setActiveLayers]
  );

  const orderedDates = useMemo(() => orderBy(dates, ['value'], ['desc']), [dates]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full">
        <div className="flex cursor-pointer items-center justify-between rounded-3xl border border-brand-800 border-opacity-50 py-1 px-4">
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

      <DropdownMenuContent
        className={cn({
          'max-h-56 space-y-1 overflow-y-auto bg-white px-2': true,
          [className.content]: !!className?.content,
        })}
      >
        {orderedDates?.map((d) => (
          <DropdownMenuItem key={d.value} className="whitespace-nowrap last-of-type:pb-4">
            <button
              id={d.label}
              value={d.value}
              className="hover:text-brand-800"
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
