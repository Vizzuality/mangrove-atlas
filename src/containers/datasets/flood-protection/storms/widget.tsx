import { useMemo, useRef, useState, useLayoutEffect, useCallback } from 'react';

import cn from 'lib/classnames';

import { activeWidgetsAtom } from 'store/widgets';
import {
  floodAreaPeriodAtom,
  floodPopulationPeriodAtom,
  floodStockPeriodAtom,
} from 'store/widgets/flood-protection';

import { useRecoilState } from 'recoil';

import Icon from 'components/icon';
import Loading from 'components/loading';
import { SwitchRoot, SwitchThumb, SwitchWrapper } from 'components/switch';
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from 'components/tooltip';
import {
  WIDGET_CARD_WRAPPER_STYLE,
  WIDGET_SENTENCE_STYLE,
  WIDGET_SUBTITLE_STYLE,
  WIDGET_SELECT_STYLES,
} from 'styles/widgets';
import { WidgetSlugType } from 'types/widget';

import ARROW_SVG from 'svgs/ui/arrow.svg?sprite';
import TRIANGLE_SVG from 'svgs/ui/triangle.svg?sprite';

import type { FloodProtectionPeriodId } from '../types';
import type { FloodProtectionIndicatorId } from '../types';

import FloodProtectionChart from './chart';
import { LABELS, UNITS_LABELS } from './constants';
import { useMangrovesFloodProtection } from './hooks';

const FloodProtection = ({ indicator }: { indicator: FloodProtectionIndicatorId }) => {
  const [lineChartWidth, setLineChartWidth] = useState(0);

  const [selectedAreaPeriod, setAreaPeriod] = useRecoilState(floodAreaPeriodAtom);

  const [selectedPopulationPeriod, setPopulationPeriod] = useRecoilState(floodPopulationPeriodAtom);

  const [selectedStockPeriod, setStockPeriod] = useRecoilState(floodStockPeriodAtom);

  const selectedPeriod = useMemo<FloodProtectionPeriodId>(() => {
    let selected: FloodProtectionPeriodId;
    switch (true) {
      case indicator === 'population':
        selected = selectedPopulationPeriod;
        break;
      case indicator === 'stock':
        selected = selectedStockPeriod;
        break;
      default:
        selected = selectedAreaPeriod;
        break;
    }
    return selected;
  }, [indicator, selectedAreaPeriod, selectedPopulationPeriod, selectedStockPeriod]);

  const handlePeriod = useCallback(
    (period: FloodProtectionPeriodId) => {
      if (indicator === 'area') {
        setAreaPeriod(period);
      } else if (indicator === 'population') {
        setPopulationPeriod(period);
      } else if (indicator === 'stock') {
        setStockPeriod(period);
      }
    },
    [indicator, setAreaPeriod, setPopulationPeriod, setStockPeriod]
  );

  const { isFetched, isFetching, data } = useMangrovesFloodProtection(selectedPeriod, {
    indicator,
  });

  const id = `mangrove_coastal_protection_${indicator}` satisfies WidgetSlugType;

  const [activeWidgets, setActiveWidgets] = useRecoilState(activeWidgetsAtom);
  const isActive = useMemo(() => activeWidgets.includes(id), [activeWidgets, id]);

  const handleClick = () => {
    const widgetsUpdate = isActive ? activeWidgets.filter((w) => w !== id) : [...activeWidgets, id];
    setActiveWidgets(widgetsUpdate);
  };

  const ref = useRef<HTMLDivElement>();
  // fires synchronously after all DOM mutations.
  useLayoutEffect(() => {
    if (ref && ref.current && ref.current.offsetWidth) {
      setLineChartWidth(ref?.current?.offsetWidth);
    }
  }, [ref.current]);

  if (!data || !data?.data?.length) return null;

  const { periods, max, min, selectedValue, location, getFormattedValue } = data;
  const isWorldwide = location === 'Worldwide';
  const maxValue = getFormattedValue(max, indicator);
  const minValue = getFormattedValue(min, indicator);
  const trianglePositionPerc = (selectedValue * 100) / max;
  const trianglePosition = (lineChartWidth * trianglePositionPerc) / 100 - 11; // substract icon size;
  const value = getFormattedValue(selectedValue, indicator);

  const getBackground = (indicator) => {
    let background;
    switch (true) {
      case indicator === 'area':
        background =
          'linear-gradient(90deg, #F3E0F7 0%, #E4C7F1 17%, #D1AFE8 33%, #AB91CF 50%, #9F82CE 67%, #826DBA 83%, #63589F 100%)';
        break;
      case indicator === 'population':
        background =
          'linear-gradient(90deg, #FFC6C4 0%, #F4A3A8 17%, #E38191 33%, #CC607D 50%, #AD466C 67%, #8B3058 83%, #672044 100%)';
        break;
      case indicator === 'stock':
        background =
          'linear-gradient(90deg, #D1EEEA 0%, #A8DBD9 17%, #85C4C9 33%, #68ABB8 50%, #4F90A6 67%, #3B738F 83%, #2A5674 100%)';
        break;
      default:
        background = '#ECECEF';
        break;
    }
    return background;
  };
  return (
    <div className={`${WIDGET_CARD_WRAPPER_STYLE} relative`}>
      <Loading visible={isFetching} iconClassName="flex w-10 h-10 m-auto my-10" />
      {!isFetching && (
        <div className="absolute top-0 -left-10 -right-10 border-2 border-b border-brand-800/30" />
      )}
      {isFetched && data && (
        <div className="space-y-4">
          <header className="flex justify-between">
            <h3 className={WIDGET_SUBTITLE_STYLE}>{indicator}</h3>
            <div className="flex items-start space-x-2">
              <SwitchWrapper id="planet_medres_visual_monthly">
                <SwitchRoot onClick={handleClick} defaultChecked={isActive} checked={isActive}>
                  <SwitchThumb />
                </SwitchRoot>
              </SwitchWrapper>
            </div>
          </header>
          {(indicator === 'population' || indicator === 'stock') && (
            <p className={WIDGET_SENTENCE_STYLE}>
              In <span className="font-bold first-letter:uppercase"> {data.location}</span>,
              mangroves protect against <span className="font-bold">intense</span> storms that occur{' '}
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className={`${WIDGET_SELECT_STYLES} print:border-hidden`}>
                    {LABELS[selectedPeriod].large}
                    <Icon
                      icon={ARROW_SVG}
                      className="absolute -bottom-2.5 left-1/2 inline-block h-2 w-2 -translate-x-1/2 print:hidden"
                    />
                  </span>
                </TooltipTrigger>

                <TooltipPortal>
                  <TooltipContent
                    side="bottom"
                    align="center"
                    className="rounded-3xl bg-white  text-black/85 shadow-soft"
                  >
                    <ul
                      className={cn({ 'max-h-56 space-y-2 overflow-y-auto scrollbar-hide': true })}
                    >
                      {periods?.map((period) => (
                        <li key={period}>
                          <button
                            className={cn({
                              'font-bold': true,
                              'hover:text-brand-800': period !== selectedPeriod,
                              'opacity-50': period === selectedPeriod,
                            })}
                            type="button"
                            onClick={() => handlePeriod(period)}
                            disabled={period === selectedPeriod}
                          >
                            {LABELS[period].short}
                          </button>
                        </li>
                      ))}
                    </ul>

                    <TooltipArrow className="fill-white" width={10} height={5} />
                  </TooltipContent>
                </TooltipPortal>
              </Tooltip>{' '}
              {indicator === 'population' && (
                <span>
                  to <span className="font-bold">{value}</span> individuals
                </span>
              )}
              {indicator === 'stock' && (
                <span>
                  built capital worth <span className="font-bold">$ {value}</span>.
                </span>
              )}
            </p>
          )}
          {indicator === 'area' && (
            <p>
              In <span className="font-bold first-letter:uppercase"> {data.location}</span>,
              mangroves are expected to protect{' '}
              <span className="font-bold">
                {' '}
                {value} km<sup>2</sup>
              </span>{' '}
              during a{' '}
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className={`${WIDGET_SELECT_STYLES} print:border-hidden`}>
                    {LABELS[selectedPeriod].area}
                    <Icon
                      icon={ARROW_SVG}
                      className="absolute -bottom-2.5 left-1/2 inline-block h-2 w-2 -translate-x-1/2 print:hidden"
                    />
                  </span>
                </TooltipTrigger>

                <TooltipPortal>
                  <TooltipContent
                    side="bottom"
                    align="center"
                    className="rounded-3xl bg-white  text-black/85 shadow-soft"
                  >
                    <ul
                      className={cn({ 'max-h-56 space-y-2 overflow-y-auto scrollbar-hide': true })}
                    >
                      {periods?.map((period) => (
                        <li key={period}>
                          <button
                            className={cn({
                              'font-bold': true,
                              'hover:text-brand-800': period !== selectedPeriod,
                              'opacity-50': period === selectedPeriod,
                            })}
                            type="button"
                            onClick={() => handlePeriod(period)}
                            disabled={period === selectedPeriod}
                          >
                            {LABELS[period].area}
                          </button>
                        </li>
                      ))}
                    </ul>

                    <TooltipArrow className="fill-white" width={10} height={5} />
                  </TooltipContent>
                </TooltipPortal>
              </Tooltip>{' '}
              .
            </p>
          )}
          <div className="flex flex-1 flex-col items-center space-y-2">
            <FloodProtectionChart data={data.config} />
          </div>
          <div className="relative flex flex-1 flex-col font-sans text-sm text-black/85 ">
            <p className="w-full text-end text-sm">{UNITS_LABELS[data.unit]}</p>

            <div
              ref={ref}
              className={cn({
                'relative h-7 w-full': true,
                'my-2.5': isWorldwide,
                'mt-8 mb-2.5': !isWorldwide,
              })}
              style={{
                background: getBackground(indicator),
              }}
            >
              {!isWorldwide && (
                <Icon
                  icon={TRIANGLE_SVG}
                  className="absolute -top-7 h-5 w-5"
                  style={{ left: trianglePosition }}
                />
              )}
            </div>
            <div className="flex w-full justify-between text-sm text-black/85">
              {[minValue, maxValue].map((l) => (
                <p key={l}>{l}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloodProtection;
