import { useCallback, useState, useMemo } from 'react';

import { useRecoilState } from 'recoil';
import { activeLayersAtom } from 'store/layers';
import cn from 'lib/classnames';

import { formatAxis } from 'lib/format';

import Icon from 'components/ui/icon';
import Loading from 'components/ui/loading';

import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from 'components/ui/select';
import { SwitchRoot, SwitchThumb, SwitchWrapper } from 'components/ui/switch';
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

import { ActiveLayers } from 'types/layers';
import { GroupedData, GroupedDataResponse } from './types';
import { useMangroveFisheryMitigationPotentials } from './hooks';

const INDICATOR_ICONS = {
  shrimp: SHRIMP_SVG,
  fish: FISH_SVG,
  crab: CRAB_SVG,
  bivalve: BIVALVE_SVG,
};

const id = 'mangrove_commercial_fisheries_production';

const LayerSentenceByCategory = ({
  length,
  indicatorsWithData,
  selectedIndicator,
  handleIndicatorSelect,
}) => (
  <span>
    Showing density for {length === 1 && <span>{indicatorsWithData[0].indicator}</span>}
    {length > 1 && selectedIndicator && (
      <Select value={selectedIndicator} onValueChange={handleIndicatorSelect}>
        <SelectTrigger
          className={cn({
            [WIDGET_SELECT_STYLES]: true,
            '!relative !inline !h-full !w-fit rounded-none border-b-2 border-brand-800 !p-0 !text-lg !font-bold':
              true,
          })}
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
          {indicatorsWithData?.map(({ indicator }) => (
            <SelectItem
              key={indicator}
              value={indicator}
              aria-label="select indicator"
              className={cn(
                'w-full rounded-lg !py-1 !px-2 text-left hover:bg-brand-800/20',
                indicator === selectedIndicator && 'font-semibold text-brand-800'
              )}
            >
              {indicator.charAt(0).toUpperCase() + indicator.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )}{' '}
    on map.
  </span>
);

const CommercialFisheriesProduction = () => {
  const [selectedIndicator, setSelectedIndicator] = useState<
    GroupedData['indicator'] | undefined
  >();

  const { isFetched, isFetching, data } =
    useMangroveFisheryMitigationPotentials<GroupedDataResponse>(
      {},
      {
        select: (data) => {
          return {
            location: data.location,
            indicators: Object.values(
              data?.data?.reduce(
                (acc, { indicator, indicator_type, value }) => {
                  if (!acc[indicator]) acc[indicator] = { indicator };
                  acc[indicator][indicator_type] = value;
                  return acc;
                },
                {} as Record<string, GroupedData>
              )
            ),
          };
        },
      }
    );

  const [activeLayers, setActiveLayers] = useRecoilState(activeLayersAtom);

  const activeLayersIds = useMemo(() => activeLayers?.map((l) => l.id), [activeLayers]);
  const isActive = useMemo(() => activeLayersIds?.includes(id), [activeLayersIds]);

  const indicatorsWithData = useMemo(() => data?.indicators?.filter((d) => d.absolute), [data]);

  const updateIndicatorAndLayer = useCallback(
    (value: GroupedData['indicator'] | undefined) => {
      setSelectedIndicator(value);
      const filteredLayers = activeLayers?.filter((w) => w.id !== id);
      setActiveLayers([
        { id, opacity: '1', visibility: 'visible', filter: value },
        ...filteredLayers,
      ] as ActiveLayers[]);
    },
    [activeLayers, setActiveLayers]
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
    (value: GroupedData['indicator']) => {
      updateIndicatorAndLayer(value);
    },
    [updateIndicatorAndLayer]
  );

  const handleIndicatorLayerToggle = useCallback(() => {
    const filteredLayers = activeLayers?.filter((w) => w.id !== id);
    const layersUpdate = isActive
      ? filteredLayers
      : ([
          { id, opacity: '1', visibility: 'visible', filter: undefined },
          ...filteredLayers,
        ] as ActiveLayers[]);
    setActiveLayers(layersUpdate);
    setSelectedIndicator(undefined);
  }, [isActive, activeLayers, setActiveLayers]);

  if (isFetched && !data?.indicators?.length) return <NoData />;

  return (
    <div className="py-2">
      <WidgetHeader id="mangrove_fisheries" title="Mangrove Commercial Fisheries Production">
        <SwitchWrapper id={id}>
          <SwitchRoot
            data-testid={id}
            onClick={handleIndicatorLayerToggle}
            defaultChecked={isActive}
            checked={isActive}
          >
            <SwitchThumb />
          </SwitchRoot>
        </SwitchWrapper>
      </WidgetHeader>

      <div className="space-y-8">
        <p className={WIDGET_SENTENCE_STYLE}>
          Mangroves' enhancement of commercial fishery production (in individuals) in{' '}
          <span className="font-bold">{data?.location}</span>.{' '}
          {isActive && indicatorsWithData?.length > 0 && (
            <>
              {selectedIndicator ? (
                <LayerSentenceByCategory
                  length={indicatorsWithData.length}
                  indicatorsWithData={indicatorsWithData}
                  selectedIndicator={selectedIndicator}
                  handleIndicatorSelect={handleIndicatorSelect}
                />
              ) : (
                <span>Showing combined density for all species on map.</span>
              )}
            </>
          )}
        </p>

        <Loading visible={isFetching && !isFetched} iconClassName="flex w-10 h-10 m-auto my-10" />

        {isFetched && data && (
          <div className="space-y-4">
            <div className="grid flex-1 grid-cols-2 flex-col items-center gap-2">
              {data.indicators?.map(({ indicator, absolute, density }) => {
                return (
                  <Tooltip key={indicator}>
                    <TooltipTrigger>
                      <button
                        id={indicator}
                        value={indicator}
                        type="button"
                        onClick={handleIndicator}
                        className="flex items-center space-x-4"
                        disabled={!density && !absolute}
                      >
                        <div
                          className={cn({
                            'box-content flex w-8 items-center justify-center rounded-md bg-grey-400/15 p-1 align-middle text-blue-400':
                              true,
                            'bg-brand-800 text-white': indicator === selectedIndicator && isActive,
                            'bg-grey-400 bg-opacity-15 text-gray-400 text-opacity-80':
                              !absolute && !density,
                          })}
                        >
                          <Icon
                            icon={INDICATOR_ICONS[indicator]}
                            className="box-content h-6 w-6 rounded-md p-1"
                          />
                        </div>
                        <div className="flex flex-col text-start text-xs">
                          <span className="first-letter:uppercase">{indicator}</span>
                          {!absolute && !density && <span className="font-bold">No data</span>}
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
                    {density && (
                      <TooltipPortal>
                        <TooltipContent
                          side="bottom"
                          align="center"
                          className="rounded-3xl bg-white p-4 text-black/85 shadow-soft first-letter:uppercase"
                        >
                          Click to {indicator === selectedIndicator ? 'hide' : 'display'} this layer
                          on the map
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
