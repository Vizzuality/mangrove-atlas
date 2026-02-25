import { useCallback, useMemo, useState } from 'react';

import cn from '@/lib/classnames';
import { formatAxis } from '@/lib/format';
import { normalize } from '@/lib/utils';

import Loading from '@/components/ui/loading';
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import WidgetControls from '@/components/widget-controls';
import { WIDGET_SELECT_STYLES, WIDGET_SENTENCE_STYLE } from 'styles/widgets';
import type { ActiveLayers } from 'types/layers';

import BIVALVE_SVG from '@/svgs/fisheries/bivalve';
import CRAB_SVG from '@/svgs/fisheries/crab';
import FISH_SVG from '@/svgs/fisheries/fish';
import SHRIMP_SVG from '@/svgs/fisheries/shrimp';
import ARROW_SVG from '@/svgs/ui/arrow-filled';

import { useMangroveCommercialFisheriesProduction } from './hooks';
import type { GroupedData, GroupedDataResponse } from './types';

const INDICATOR_ICONS = {
  shrimp: SHRIMP_SVG,
  finfish: FISH_SVG,
  crab: CRAB_SVG,
  bivalve: BIVALVE_SVG,
} as const;

const id = 'mangrove_commercial_fisheries_production';

const cmp = (a: string, b: string) => {
  const A = normalize(a);
  const B = normalize(b);
  return A < B ? -1 : A > B ? 1 : 0;
};

const CommercialFisheriesProduction = () => {
  const [selectedIndicator, setSelectedIndicator] = useState<GroupedData['indicator']>('finfish');
  const setActiveLayers = useSetRecoilState(activeLayersAtom);

  const { isFetched, isFetching, data } =
    useMangroveCommercialFisheriesProduction<GroupedDataResponse>(
      {},
      {
        select: (raw) => {
          const acc: Record<string, GroupedData> = {};

          raw?.data?.forEach(({ indicator, indicator_type, value }) => {
            acc[indicator] ??= { indicator } as GroupedData;
            (acc[indicator] as any)[indicator_type] = value;
          });
          return {
            location: raw.location,
            indicators: Object.values(acc),
          };
        },
      }
    );
  // Sort once (case/diacritics-insensitive)
  const indicatorsWithData = useMemo(() => {
    const list = data?.indicators?.filter((d) => d.absolute) ?? [];
    return [...list].sort((a, b) => cmp(a.indicator, b.indicator));
  }, [data]);

  const updateIndicatorAndLayer = useCallback(
    (value: GroupedData['indicator']) => {
      setSelectedIndicator(value);
      setActiveLayers((prev) => {
        const filtered = (prev ?? []).filter((w) => w.id !== id);
        const layer = {
          id,
          opacity: '1',
          visibility: 'visible',
          filter: value,
        };
        return [layer, ...filtered] as ActiveLayers[];
      });
    },
    [setActiveLayers]
  );

  const handleIndicator = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const value = (e.currentTarget?.value || e) as GroupedData['indicator'];
      updateIndicatorAndLayer(value);
    },
    [updateIndicatorAndLayer]
  );

  const averageValueByIndicator = useMemo(() => {
    if (isFetched && !data?.indicators?.length) return null;
    const indicatorData = data?.indicators?.find((d) => d.indicator === selectedIndicator);
    return formatAxis(indicatorData?.density || 0);
  }, [data, selectedIndicator]);

  if (isFetched && !data?.indicators?.length) return <NoData />;

  return (
    <div className="py-2">
      <WidgetHeader id="mangrove_fisheries" title="Mangrove Commercial Fisheries Production">
        <WidgetControls id={id} />
      </WidgetHeader>

      <div className="space-y-8">
        <p className={WIDGET_SENTENCE_STYLE}>
          In <span className="font-bold">{data?.location}</span>, mangroves enhance commercial
          fishery production of{' '}
          <Select value={selectedIndicator} onValueChange={handleIndicator as any}>
            <SelectTrigger
              className={cn(
                WIDGET_SELECT_STYLES,
                'border-brand-800 relative! inline! h-full! w-fit! rounded-none border-b-2 p-0! text-lg! font-bold!'
              )}
              aria-label="Select indicator"
            >
              <SelectValue className="inline-flex w-fit" />
              <ARROW_SVG
                className="absolute -bottom-2.5 left-1/2 inline-block h-2 w-2 -translate-x-1/2 fill-current print:hidden"
                role="img"
                title="Arrow"
              />
            </SelectTrigger>
            <SelectContent
              sideOffset={48}
              align="center"
              className="flex w-fit flex-col space-y-0.5 rounded-3xl bg-white px-1 py-2 text-sm shadow-sm"
            >
              {indicatorsWithData.map(({ indicator }) => (
                <SelectItem
                  key={indicator}
                  value={indicator}
                  aria-label={`Select ${indicator}`}
                  className={cn(
                    'hover:bg-brand-800/20 w-full rounded-lg px-2! py-1! text-left',
                    indicator === selectedIndicator && 'text-brand-800 font-semibold'
                  )}
                >
                  {indicator}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>{' '}
          by an average of <span className="font-bold">{averageValueByIndicator}</span>{' '}
          <span className="whitespace-nowrap">individuals / 100 m² (10 m × 10 m).</span>
        </p>

        <Loading visible={isFetching && !isFetched} iconClassName="flex w-10 h-10 m-auto my-10" />

        {isFetched && data && (
          <div className="space-y-4">
            <div className="grid flex-1 grid-cols-2 flex-col items-center gap-2">
              {data.indicators
                ?.slice()
                .sort((a, b) => cmp(a.indicator, b.indicator))
                .map(({ indicator, absolute, density }) => {
                  const disabled = !density && !absolute;
                  const selected = indicator === selectedIndicator;
                  const IndicatorIcon = INDICATOR_ICONS[indicator as keyof typeof INDICATOR_ICONS];
                  return (
                    <button
                      id={indicator}
                      value={indicator}
                      type="button"
                      onClick={handleIndicator}
                      className="flex items-center space-x-4"
                      disabled={disabled}
                      aria-disabled={disabled}
                      aria-pressed={selected}
                      aria-label={
                        disabled
                          ? `${indicator}: no data`
                          : `${indicator}: ${selected ? 'selected' : 'select'}`
                      }
                    >
                      <div
                        className={cn(
                          'bg-grey-400/15 box-content flex w-8 items-center justify-center rounded-md p-1 align-middle text-blue-400',
                          selected && 'bg-brand-800 text-white',
                          disabled && 'bg-grey-400 bg-opacity-15 text-opacity-80 text-gray-400'
                        )}
                      >
                        <IndicatorIcon
                          className="box-content h-6 w-6 rounded-md fill-current p-1"
                          role="img"
                          aria-hidden={true}
                        />
                      </div>
                      <div className="flex flex-col text-start text-xs">
                        <span className="first-letter:uppercase">{indicator}</span>
                        {disabled && <span className="font-bold">No data</span>}
                        {!!absolute && (
                          <span className="font-bold">{formatAxis(Math.round(absolute))}</span>
                        )}
                        {!!density && (
                          <span className="text-[10px] font-bold">
                            ({formatAxis(Math.round(density))} / 100 m<sup>2</sup>)
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommercialFisheriesProduction;
