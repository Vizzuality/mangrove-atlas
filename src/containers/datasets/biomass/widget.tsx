import { useCallback, useState } from 'react';

import { analysisAtom } from 'store/analysis';
import { BiomassYearSettings } from 'store/widgets/biomass';

import { useQueryClient } from '@tanstack/react-query';
import { useRecoilState, useRecoilValue } from 'recoil';

import NoData from 'containers/widgets/no-data';

import Loading from 'components/ui/loading';
import { WIDGET_CARD_WRAPPER_STYLE, WIDGET_SENTENCE_STYLE } from 'styles/widgets';

import BiomassChart from './chart';
import { useMangroveBiomass, widgetSlug } from './hooks';

const BiomassWidget = () => {
  const [defaultYear, setYear] = useRecoilState(BiomassYearSettings);
  const [isCanceled, setIsCanceled] = useState(false);
  const { enabled: isAnalysisRunning } = useRecoilValue(analysisAtom);
  const queryClient = useQueryClient();
  const handleQueryCancellation = useCallback(() => {
    setIsCanceled(true);
  }, []);

  const { year, mean, unit, config, isFetching, location, refetch, isError, noData } =
    useMangroveBiomass({}, { enabled: !isCanceled }, handleQueryCancellation);

  if (year !== defaultYear) setYear(year);

  const handleCancelAnalysis = useCallback(async () => {
    await queryClient.cancelQueries({
      predicate: ({ queryKey }) => queryKey.includes(widgetSlug),
      fetchStatus: 'fetching',
    });
  }, [queryClient]);

  const handleTryAgain = useCallback(async () => {
    await refetch();
    setIsCanceled(false);
  }, [refetch]);

  const { legend } = config;

  if (noData) return <NoData />;

  return (
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
      <div className="flex flex-col items-center space-y-4">
        <Loading visible={isFetching} iconClassName="flex w-10 h-10 m-auto my-10" />
        {isAnalysisRunning && isFetching && (
          <button
            aria-label="cancel analysis"
            type="button"
            onClick={() => void handleCancelAnalysis()}
            className="rounded-2xl bg-brand-800 px-6 py-1 text-sm text-white active:ring-2 active:ring-inset active:ring-brand-600"
          >
            Cancel analysis
          </button>
        )}
      </div>
      {(!isCanceled || isError) && !isFetching && (
        <div className="flex flex-col items-center space-y-4">
          <p className={`${WIDGET_SENTENCE_STYLE} italic`}>
            An error occurred while fetching the data. You can try again.
          </p>
          <button
            type="button"
            onClick={handleTryAgain}
            className="rounded-2xl bg-brand-800 px-6 py-1 text-sm text-white active:ring-2 active:ring-inset active:ring-brand-600"
          >
            Try again
          </button>
        </div>
      )}
      {mean && !isFetching && !isError && (
        <>
          <p className={WIDGET_SENTENCE_STYLE}>
            Mean mangrove aboveground biomass density in{' '}
            <span className="font-bold"> {location}</span> was{' '}
            <span className="font-bold">
              {mean} {unit}
            </span>{' '}
            in <span className="font-bold"> {year}</span>.
          </p>

          <BiomassChart legend={legend} config={config} />
        </>
      )}
    </div>
  );
};

export default BiomassWidget;
