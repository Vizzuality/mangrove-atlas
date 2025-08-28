import { useCallback, useMemo } from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectIcon } from 'components/ui/select';
import { ChevronDownIcon } from '@radix-ui/react-icons';

import cn from 'lib/classnames';
import { trackEvent } from 'lib/analytics/ga';

import { activeLayersAtom } from 'store/layers';
import { orderBy } from 'lodash-es';
import { useRecoilState } from 'recoil';

import type { BasemapId } from 'containers/datasets/contextual-layers/basemaps';
import { useMosaicsFromSeriesPlanetSatelliteBasemaps } from 'containers/datasets/contextual-layers/basemaps-planet/hooks';

import type { ContextualBasemapsId, MosaicId, WidgetSlugType } from 'types/widget';

const DateSelect = ({
  id,
  mosaic_id,
}: {
  id: ContextualBasemapsId | BasemapId | WidgetSlugType;
  mosaic_id: MosaicId;
  className?: { content: string };
}) => {
  const { data: dates } = useMosaicsFromSeriesPlanetSatelliteBasemaps(mosaic_id);
  const [activeLayers, setActiveLayers] = useRecoilState(activeLayersAtom);

  const layerToUpdate = useMemo(
    () => activeLayers?.find((layer) => layer.id === id),
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
    (value: string) => {
      const filteredLayers = activeLayers?.filter((l) => l.id !== id);
      if (!!layerToUpdate) {
        setActiveLayers([
          {
            ...layerToUpdate,
            id: id as ContextualBasemapsId,
            settings: {
              ...layerToUpdate.settings,
              date: value,
            },
          },
          ...filteredLayers,
        ]);
      }

      // Google Analytics tracking
      trackEvent(`Contextual Basemap settings - Date - ${id}`, {
        category: 'Layers - Contextual',
        action: 'Select',
        label: `Contextual Basemap - ${id}. Selected date: ${value}`,
        value: value,
      });
    },
    [layerToUpdate, activeLayers, id, setActiveLayers]
  );

  const orderedDates = useMemo(() => orderBy(dates, ['value'], ['desc']), [dates]);

  return (
    <Select value={selectedDate} onValueChange={handleDate}>
      <SelectTrigger
        className="z-[70] flex h-full w-full cursor-pointer items-center justify-between rounded-3xl border border-brand-800 border-opacity-50 px-4 py-1"
        aria-label="Select period"
      >
        <p>
          Period: <span className="text-sm font-bold">{labelToDisplay}</span>
        </p>
        <SelectIcon>
          <ChevronDownIcon className="h-4 w-4" />
        </SelectIcon>
      </SelectTrigger>

      <SelectContent
        className="z-[70] flex max-h-56 cursor-pointer items-center justify-between overflow-y-auto rounded-3xl border bg-white py-2 px-4 text-sm shadow-md"
        alignOffset={0}
        sideOffset={-30}
      >
        {orderedDates?.map((d) => (
          <SelectItem
            key={d.value}
            value={d.value}
            className={cn('cursor-pointer rounded py-1 px-2 text-sm hover:bg-brand-800/20', {
              'font-semibold text-brand-800': d.value === selectedDate,
            })}
          >
            {d.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DateSelect;
