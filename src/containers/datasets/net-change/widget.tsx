import { useCallback, useState } from 'react';

import cn from 'lib/classnames';

import { analysisAtom } from 'store/analysis';
import { netChangeStartYear, netChangeEndYear } from 'store/widgets/net-change';

import { useQueryClient } from '@tanstack/react-query';
import { useRecoilState, useRecoilValue } from 'recoil';

import Icon from 'components/icon';
import Loading from 'components/loading';
import {
  Tooltip,
  TooltipContent,
  TooltipArrow,
  TooltipTrigger,
  TooltipPortal,
} from 'components/tooltip';

import ARROW_SVG from 'svgs/ui/arrow-filled.svg?sprite';

import NetChangeChart from './chart';
import { useMangroveNetChange, widgetSlug } from './hooks';

const NetChangeWidget = () => {
  const queryClient = useQueryClient();
  const [selectedUnit, setUnit] = useState('km²');
  const [startYear, setStartYear] = useRecoilState(netChangeStartYear);
  const [endYear, setEndYear] = useRecoilState(netChangeEndYear);
  const { enabled: isAnalysisRunning } = useRecoilValue(analysisAtom);

  const [isCanceled, setIsCanceled] = useState(false);

  const handleQueryCancellation = useCallback(() => {
    setIsCanceled(true);
  }, []);

  const handleCancelAnalysis = useCallback(async () => {
    await queryClient.cancelQueries({
      predicate: ({ queryKey }) => queryKey.includes(widgetSlug),
      fetchStatus: 'fetching',
    });
  }, [queryClient]);

  const {
    netChange,
    direction,
    config,
    location,
    unitOptions,
    years,
    data,
    isFetching,
    currentEndYear,
    currentStartYear,
    refetch,
    isError,
    noData,
  } = useMangroveNetChange(
    {
      selectedUnit,
      startYear,
      endYear,
    },
    { enabled: !isCanceled },
    handleQueryCancellation
  );

  const handleTryAgain = useCallback(async () => {
    setIsCanceled(false);
    await refetch();
  }, [refetch]);

  if (noData && !isAnalysisRunning) return null;
  return (
    <div>
      <div className="flex flex-col items-center space-y-4">
        <Loading visible={isFetching} iconClassName="flex w-10 h-10 m-auto my-10" />
        {isAnalysisRunning && isFetching && !isCanceled && (
          <button
            type="button"
            onClick={handleCancelAnalysis}
            className="rounded-2xl bg-brand-800 px-6 py-1 text-sm text-white active:ring-2 active:ring-inset active:ring-brand-600"
          >
            Cancel analysis
          </button>
        )}
      </div>
      {(isCanceled || isError) && !isFetching && (
        <div className="flex flex-col items-center space-y-4">
          <p>An error occurred while fetching the data. You can try again.</p>
          <button
            type="button"
            onClick={handleTryAgain}
            className="rounded-2xl bg-brand-800 px-6 py-1 text-sm text-white active:ring-2 active:ring-inset active:ring-brand-600"
          >
            Try again
          </button>
        </div>
      )}
      {data && !isFetching && !isError && !isCanceled && (
        <div>
          <p>
            The extent of mangroves in <span className="font-bold"> {location}</span> has{' '}
            <span className="font-bold"> {direction}</span> by{' '}
            <span className="font-bold"> {netChange}</span>{' '}
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="first-line:after relative cursor-pointer border-b-2 border-b-brand-800 font-bold">
                  {selectedUnit}
                  <Icon
                    icon={ARROW_SVG}
                    className="absolute -bottom-2.5 left-1/2 inline-block h-2 w-2 -translate-x-1/2"
                  />
                </span>
              </TooltipTrigger>

              <TooltipPortal>
                <TooltipContent
                  side="bottom"
                  align="center"
                  className="rounded-[20x] bg-white  text-black/85 shadow-soft"
                >
                  <ul className={cn({ 'max-h-56 space-y-2 overflow-y-auto scrollbar-hide': true })}>
                    {unitOptions?.map((u) => (
                      <li key={u}>
                        <button
                          className={cn({
                            'font-bold': true,
                            'hover:text-brand-800': selectedUnit !== u,
                            'opacity-50': selectedUnit === u,
                          })}
                          type="button"
                          onClick={() => setUnit(u)}
                          disabled={selectedUnit === u}
                        >
                          {u}
                        </button>
                      </li>
                    ))}
                  </ul>

                  <TooltipArrow className=" fill-white" width={10} height={5} />
                </TooltipContent>
              </TooltipPortal>
            </Tooltip>{' '}
            between{' '}
            <Tooltip>
              <TooltipTrigger>
                <span className="first-line:after relative cursor-pointer border-b-2 border-b-brand-800 font-bold">
                  {currentStartYear}
                  <Icon
                    icon={ARROW_SVG}
                    className="absolute -bottom-2.5 left-1/2 inline-block h-2 w-2 -translate-x-1/2"
                  />
                </span>
              </TooltipTrigger>

              <TooltipPortal>
                <TooltipContent
                  side="bottom"
                  align="center"
                  className="rounded-[20x] bg-white  text-black/85 shadow-soft"
                >
                  <ul className={cn({ 'max-h-56 space-y-2 overflow-y-auto scrollbar-hide': true })}>
                    {years?.map((y) => (
                      <li key={y}>
                        <button
                          className={cn({
                            'font-bold': true,
                            'text-brand-800': currentStartYear === y,
                            'hover:text-brand-800': currentStartYear !== y && y < currentEndYear,
                            'opacity-50':
                              currentStartYear === y || y > currentEndYear || currentEndYear === y,
                          })}
                          type="button"
                          onClick={() => setStartYear(y)}
                          disabled={
                            currentStartYear === y || y > currentEndYear || currentEndYear === y
                          }
                        >
                          {y}
                        </button>
                      </li>
                    ))}
                  </ul>

                  <TooltipArrow />
                </TooltipContent>
              </TooltipPortal>
            </Tooltip>{' '}
            and{' '}
            <Tooltip>
              <TooltipTrigger>
                <span className="first-line:after relative cursor-pointer border-b-2 border-b-brand-800 font-bold">
                  {currentEndYear}
                  <Icon
                    icon={ARROW_SVG}
                    className="absolute -bottom-2.5 left-1/2 inline-block h-2 w-2 -translate-x-1/2"
                  />
                </span>
              </TooltipTrigger>

              <TooltipPortal>
                <TooltipContent
                  side="bottom"
                  align="center"
                  className="rounded-[20x] bg-white  text-black/85 shadow-soft"
                >
                  <ul className={cn({ 'max-h-56 space-y-2 overflow-y-auto scrollbar-hide': true })}>
                    {years?.map((y) => (
                      <li key={y}>
                        <button
                          className={cn({
                            'font-bold': true,
                            'text-brand-800': currentEndYear === y,
                            'hover:text-brand-800': currentEndYear !== y && y > currentStartYear,
                            'opacity-50': y < currentStartYear || currentStartYear === y,
                          })}
                          type="button"
                          onClick={() => setEndYear(y)}
                          disabled={
                            currentEndYear === y || y < currentStartYear || currentStartYear === y
                          }
                        >
                          {y}
                        </button>
                      </li>
                    ))}
                  </ul>

                  <TooltipArrow />
                </TooltipContent>
              </TooltipPortal>
            </Tooltip>
            .
          </p>

          <NetChangeChart config={config} />
        </div>
      )}
    </div>
  );
};

export default NetChangeWidget;
