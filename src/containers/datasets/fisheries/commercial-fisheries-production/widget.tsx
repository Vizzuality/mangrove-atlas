import { useCallback, useState, useMemo } from 'react';
import NoData from 'containers/widgets/no-data';
import cn from 'lib/classnames';

import Loading from 'components/ui/loading';
import { WIDGET_SENTENCE_STYLE, WIDGET_SELECT_STYLES } from 'styles/widgets';

import WidgetHeader from 'containers/widget/header';

import { formatAxis } from 'lib/format';

import Icon from 'components/ui/icon';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { SwitchRoot, SwitchThumb, SwitchWrapper } from 'components/ui/switch';

import BIVALVE_SVG from 'svgs/fisheries/bivalve.svg';
import CRAB_SVG from 'svgs/fisheries/crab.svg?sprite';
import FISH_SVG from 'svgs/fisheries/fish.svg?sprite';
import SHRIMP_SVG from 'svgs/fisheries/shrimp.svg?sprite';

import { useMangroveFisheryMitigationPotentials } from './hooks';

import ARROW_SVG from 'svgs/ui/arrow.svg';
import { Data, GroupedData, GroupedDataResponse } from '../types';
import { useRecoilState } from 'recoil';
import { activeLayersAtom } from 'store/layers';
import { ActiveLayers } from 'types/layers';

const INDICATOR_ICONS = {
  shrimp: SHRIMP_SVG,
  fish: FISH_SVG,
  crab: CRAB_SVG,
  bivalve: BIVALVE_SVG,
};

const INDICATOR_LAYERS = {
  shrimp: SHRIMP_SVG,
  fish: 'commercial_fisheries_production_fish',
  crab: CRAB_SVG,
  bivalve: BIVALVE_SVG,
};

const id = 'commercial_fisheries_production_fish';

const CommercialFisheriesProduction = () => {
  const [selectedIndicator, setSelectedIndicator] = useState<GroupedData['indicator']>();

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
                  if (!acc[indicator]) {
                    acc[indicator] = { indicator };
                  }
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

  const indicatorsWithData = useMemo(() => data?.indicators?.filter((d) => d.absolute), [data]);

  const handleIndicator = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const value = e.currentTarget.value as Data['indicator'];
      setSelectedIndicator(value);
    },
    [setSelectedIndicator]
  );

  const handleIndicatorLayer = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const value = e.currentTarget.id as Data['indicator'];

    const layersUpdate = isActive
      ? activeLayers?.filter((w) => w.id !== id)
      : ([{ id, opacity: '1', visibility: 'visible' }, ...activeLayers] as ActiveLayers[]);
    setActiveLayers(layersUpdate);
  }, []);

  if (isFetched && !data?.indicators?.length) return <NoData />;
  const [activeLayers, setActiveLayers] = useRecoilState(activeLayersAtom);

  const activeLayersIds = activeLayers?.map((l) => l.id);
  const isActive = useMemo(() => activeLayersIds?.includes(id), [activeLayersIds, id]);

  return (
    <div className="py-2">
      <Loading visible={isFetching && !isFetched} iconClassName="flex w-10 h-10 m-auto my-10" />
      <WidgetHeader id="mangrove_fisheries" title="Mangrove Commercial Fisheries Production">
        <SwitchWrapper id="commercial_fisheries_production_fish">
          <SwitchRoot
            data-testid="commercial_fisheries_production_fish"
            onClick={handleIndicatorLayer}
            defaultChecked={isActive}
            checked={isActive}
          >
            <SwitchThumb />
          </SwitchRoot>
        </SwitchWrapper>
      </WidgetHeader>
      <div className="space-y-8">
        <p className={WIDGET_SENTENCE_STYLE}>
          Mangroves' enhancement of commercial fishery production (in individuals) in {' '}
          <span className="font-bold"> {data?.location}</span>. Showing density for{' '}
          {indicatorsWithData?.length === 1 && <span>{indicatorsWithData[0].indicator}</span>}
          {indicatorsWithData?.length > 1 && (
            <Popover>
              <PopoverTrigger>
                <span className={`${WIDGET_SELECT_STYLES} print:border-hidden`}>
                  {selectedIndicator || indicatorsWithData?.[0]?.indicator}
                  <Icon
                    icon={ARROW_SVG}
                    className="absolute -bottom-2.5 left-1/2 inline-block h-2 w-2 -translate-x-1/2 print:hidden"
                    description="Arrow"
                  />
                </span>
              </PopoverTrigger>

              <PopoverContent className="rounded-2xl px-2 shadow-border">
                <ul className="z-20 max-h-56 space-y-0.5">
                  {indicatorsWithData?.map(({ indicator }) => (
                    <li key={indicator} className="last-of-type:pb-4">
                      <button
                        aria-label="Select start date"
                        className={cn({
                          'w-full rounded-lg py-1 px-2 text-left hover:bg-brand-800/20': true,
                          'font-semibold text-brand-800': indicator === selectedIndicator,
                        })}
                        type="button"
                        onClick={() => {
                          setSelectedIndicator(indicator as GroupedData['indicator']);
                        }}
                      >
                        {indicator}
                      </button>
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
          )}{' '}
          on map.
        </p>
        {isFetched && data && (
          <div className="space-y-4">
            <div className="grid flex-1 grid-cols-2 flex-col items-center gap-2">
              {data.indicators?.map(({ indicator, absolute, density }) => (
                <button
                  id={indicator}
                  value={indicator}
                  type="button"
                  key={indicator}
                  onClick={handleIndicator}
                  className="flex items-center space-x-4"
                  disabled={!absolute && !density}
                >
                  <div
                    className={cn({
                      'box-content flex w-8 items-center justify-center rounded-md bg-grey-400/15 p-1 align-middle text-blue-400':
                        true,
                      'bg-brand-800 text-white': selectedIndicator
                        ? indicator === selectedIndicator
                        : indicator === indicatorsWithData?.[0]?.indicator,
                      'bg-grey-400 bg-opacity-15 text-gray-400 text-opacity-80':
                        !absolute && !density,
                    })}
                  >
                    <Icon
                      icon={INDICATOR_ICONS[indicator]}
                      className={cn({
                        'box-content h-6 w-6 rounded-md p-1': true,
                      })}
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
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommercialFisheriesProduction;
