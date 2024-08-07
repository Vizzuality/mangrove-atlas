import { useState, useCallback } from 'react';

import { analysisAtom } from 'store/analysis';

import { useQueryClient } from '@tanstack/react-query';
import { useRecoilValue } from 'recoil';

import NoData from 'containers/widgets/no-data';

import Loading from 'components/ui/loading';
import { WIDGET_CARD_WRAPPER_STYLE, WIDGET_SENTENCE_STYLE } from 'styles/widgets';

import HeightChart from './chart';
import { useMangroveHeight, widgetSlug } from './hooks';

const HeightWidget = () => {
  const [isCanceled, setIsCanceled] = useState(false);
  const { enabled: isAnalysisRunning } = useRecoilValue(analysisAtom);

  const queryClient = useQueryClient();

  const handleQueryCancellation = useCallback(() => {
    setIsCanceled(true);
  }, []);

  const handleCancelAnalysis = useCallback(async () => {
    await queryClient.cancelQueries({
      predicate: ({ queryKey }) => queryKey.includes(widgetSlug),
      fetchStatus: 'fetching',
    });
  }, [queryClient]);

  const { noData, location, legend, isFetching, isError, data, mean, unit, year, config, refetch } =
    useMangroveHeight({}, { enabled: !isCanceled }, handleQueryCancellation);

  const handleTryAgain = useCallback(async () => {
    await refetch();
    setIsCanceled(false);
  }, [refetch]);

  if (noData) return <NoData />;
  return (
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
      <div className="flex flex-col items-center space-y-4">
        <Loading visible={isFetching} iconClassName="flex w-10 h-10 m-auto my-10" />
        {isAnalysisRunning && isFetching && (
          <button
            aria-label="Cancel analysis"
            type="button"
            onClick={handleCancelAnalysis}
            className="rounded-2xl bg-brand-800 px-6 py-1 text-sm text-white active:ring-2 active:ring-inset active:ring-brand-600"
          >
            Cancel analysis
          </button>
        )}
      </div>
      {(!isCanceled || isError) && !isFetching && !data && (
        <div className="flex flex-col items-center space-y-4">
          <p className={`${WIDGET_SENTENCE_STYLE} italic`}>
            An error occurred while fetching the data. You can try again.
          </p>
          <button
            aria-label="Try again"
            type="button"
            onClick={handleTryAgain}
            className="rounded-2xl bg-brand-800 px-6 py-1 text-sm text-white active:ring-2 active:ring-inset active:ring-brand-600"
          >
            Try again
          </button>
        </div>
      )}
      {!!data && !isFetching && !isError && (
        <div>
          <p className={WIDGET_SENTENCE_STYLE}>
            Mean mangrove maximum canopy height in <span className="font-bold"> {location}</span>{' '}
            was{' '}
            <span className="font-bold">
              {' '}
              {mean} {unit}
            </span>{' '}
            in <span className="font-bold"> {year}</span>.
          </p>
          <HeightChart config={config} legend={legend} />
        </div>
      )}
    </div>
  );
};

export default HeightWidget;
