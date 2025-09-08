import { useCallback, useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';
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

import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from 'components/ui/tooltip';

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
import { useMangroveFisheryMitigationPotentials } from './hooks';
import WidgetControls from 'components/widget-controls';

const INDICATOR_ICONS = {
  shrimp: SHRIMP_SVG,
  fish: FISH_SVG,
  crab: CRAB_SVG,
  bivalve: BIVALVE_SVG,
} as const;

const id = 'mangrove_commercial_fisheries_production';

const cmp = (a: string, b: string) => {
  const A = normalize(a);
  const B = normalize(b);
  return A < B ? -1 : A > B ? 1 : 0;
};
const LayerSentenceByCategory = ({
  length,
  indicatorsWithData,
  selectedIndicator,
  handleIndicatorSelect,
}: {
  length: number;
  indicatorsWithData: Array<Pick<GroupedData, 'indicator'>>;
  selectedIndicator: GroupedData['indicator'] | 'all' | undefined;
  handleIndicatorSelect: (value: GroupedData['indicator'] | 'all') => void;
}) => (
  <span>
    Showing {(selectedIndicator === 'all' || !selectedIndicator) && ' combined '}density for{' '}
    {length === 1 && <span>{indicatorsWithData[0].indicator}</span>}
    <Select value={selectedIndicator ?? 'all'} onValueChange={handleIndicatorSelect as any}>
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
        <SelectItem
          key="all"
          value="all"
          aria-label="Select all species"
          className={cn(
            'w-full rounded-lg !py-1 !px-2 text-left hover:bg-brand-800/20',
            selectedIndicator === 'all' && 'font-semibold text-brand-800'
          )}
        >
          all species
        </SelectItem>
      </SelectContent>
    </Select>{' '}
    on map.
  </span>
);

const CommercialFisheriesProduction = () => {
  const [selectedIndicator, setSelectedIndicator] = useState<
    GroupedData['indicator'] | 'all' | undefined
  >();

  const { isFetched, isFetching, data } =
    useMangroveFisheryMitigationPotentials<GroupedDataResponse>(
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

  const [activeLayers, setActiveLayers] = useRecoilState(activeLayersAtom);

  const isActive = useMemo(() => activeLayers?.some((l) => l.id === id) ?? false, [activeLayers]);

  // Sort once (case/diacritics-insensitive)
  const indicatorsWithData = useMemo(() => {
    const list = data?.indicators?.filter((d) => d.absolute) ?? [];
    return [...list].sort((a, b) => cmp(a.indicator, b.indicator));
  }, [data]);

  const updateIndicatorAndLayer = useCallback(
    (value: GroupedData['indicator'] | 'all' | undefined) => {
      setSelectedIndicator(value);
      setActiveLayers((prev) => {
        const filtered = (prev ?? []).filter((w) => w.id !== id);
        const layer = {
          id,
          opacity: '1',
          visibility: 'visible',
          ...(value && value !== 'all' ? { filter: value } : {}),
        };
        return [layer, ...filtered] as ActiveLayers[];
      });
    },
    [setActiveLayers]
  );

  const handleIndicator = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const value = e.currentTarget.value as GroupedData['indicator'];
      const isSame = value === selectedIndicator;
      updateIndicatorAndLayer(isSame ? undefined : value);
    },
    [selectedIndicator, updateIndicatorAndLayer]
  );

  const handleIndicatorSelect = useCallback(
    (value: GroupedData['indicator'] | 'all') => {
      updateIndicatorAndLayer(value);
    },
    [updateIndicatorAndLayer]
  );

  const handleIndicatorLayerToggle = useCallback(
    (checked: boolean) => {
      setActiveLayers((prev) => {
        const filtered = (prev ?? []).filter((w) => w.id !== id);
        return checked
          ? ([
              { id, opacity: '1', visibility: 'visible' } as ActiveLayers,
              ...filtered,
            ] as ActiveLayers[])
          : (filtered as ActiveLayers[]);
      });
      setSelectedIndicator(undefined);
    },
    [setActiveLayers]
  );

  if (isFetched && !data?.indicators?.length) return <NoData />;

  return (
    <div className="py-2">
      <WidgetHeader id="mangrove_fisheries" title="Mangrove Commercial Fisheries Production">
        <WidgetControls id={id} />
      </WidgetHeader>

      <div className="space-y-8">
        <p className={WIDGET_SENTENCE_STYLE}>
          Mangroves' enhancement of commercial fishery production (in individuals) in{' '}
          <span className="font-bold">{data?.location}</span>.{' '}
          {isActive && indicatorsWithData.length > 0 && (
            <LayerSentenceByCategory
              length={indicatorsWithData.length}
              indicatorsWithData={indicatorsWithData}
              selectedIndicator={selectedIndicator}
              handleIndicatorSelect={handleIndicatorSelect}
            />
          )}
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
                  const selected = indicator === selectedIndicator && isActive;

                  return (
                    <Tooltip key={indicator}>
                      <TooltipTrigger asChild>
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
                      </TooltipTrigger>

                      {!!density && !!absolute && (
                        <TooltipPortal>
                          <TooltipContent
                            side="bottom"
                            align="center"
                            className="rounded-3xl bg-white p-4 text-black/85 shadow-soft first-letter:uppercase"
                          >
                            Click to {selected ? 'hide' : 'display'} this layer on the map
                            <TooltipArrow className="fill-white" width={10} height={5} />
                          </TooltipContent>
                        </TooltipPortal>
                      )}
                    </Tooltip>
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
