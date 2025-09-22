import { useCallback, useMemo, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { activeLayersAtom } from 'store/layers';
import cn from 'lib/classnames';
import { formatAxis } from 'lib/format';

import { normalize } from 'lib/utils';

import Icon from 'components/ui/icon';
import Loading from 'components/ui/loading';

import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from 'components/ui/select';

import BIVALVE_SVG from 'svgs/fisheries/bivalve.svg';
import CRAB_SVG from 'svgs/fisheries/crab.svg?sprite';
import FISH_SVG from 'svgs/fisheries/fish.svg?sprite';
import SHRIMP_SVG from 'svgs/fisheries/shrimp.svg?sprite';
import ARROW_SVG from 'svgs/ui/arrow-filled.svg?sprite';

import WidgetHeader from 'containers/widget/header';
import NoData from 'containers/widgets/no-data';

import { WIDGET_SELECT_STYLES, WIDGET_SENTENCE_STYLE } from 'styles/widgets';

import type { ActiveLayers } from 'types/layers';
import type { GroupedData, GroupedDataResponse } from './types';
import { useMangroveCommercialFisheriesProduction } from './hooks';
import WidgetControls from 'components/widget-controls';

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
                '!relative !inline !h-full !w-fit rounded-none border-b-2 border-brand-800 !p-0 !text-lg !font-bold'
              )}
              aria-label="Select indicator"
            >
              <SelectValue className="inline-flex w-fit" />
              <Icon
                icon={ARROW_SVG}
                className="absolute -bottom-2.5 left-1/2 inline-block h-2 w-2 -translate-x-1/2 print:hidden"
                description="Arrow"
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
                    'w-full rounded-lg !py-1 !px-2 text-left hover:bg-brand-800/20',
                    indicator === selectedIndicator && 'font-semibold text-brand-800'
                  )}
                >
                  {indicator}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>{' '}
          by an average of <span className="font-bold">{averageValueByIndicator}</span>{' '}
          individuals/100m<sup>2</sup> (10mx10m).
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
                          'box-content flex w-8 items-center justify-center rounded-md bg-grey-400/15 p-1 align-middle text-blue-400',
                          selected && 'bg-brand-800 text-white',
                          disabled && 'bg-grey-400 bg-opacity-15 text-gray-400 text-opacity-80'
                        )}
                      >
                        <Icon
                          icon={INDICATOR_ICONS[indicator as keyof typeof INDICATOR_ICONS]}
                          className="box-content h-6 w-6 rounded-md p-1"
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
