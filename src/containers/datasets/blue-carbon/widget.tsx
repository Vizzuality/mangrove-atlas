import { useCallback, useState } from 'react';

import { useRouter } from 'next/router';

import cn from 'lib/classnames';

import { analysisAtom } from 'store/analysis';

import { useQueryClient } from '@tanstack/react-query';
import { useRecoilValue } from 'recoil';

import Loading from 'components/loading';
import { WIDGET_CARD_WRAPPER_STYLE, WIDGET_SENTENCE_STYLE } from 'styles/widgets';

import BlueCarbonChart from './chart';
import { useMangroveBlueCarbon, widgetSlug } from './hooks';

const BlueCarbonWidget = () => {
  const [isCanceled, setIsCanceled] = useState(false);
  const queryClient = useQueryClient();
  const { enabled: isAnalysisRunning } = useRecoilValue(analysisAtom);
  const handleQueryCancellation = useCallback(() => {
    setIsCanceled(true);
  }, []);

  const handleCancelAnalysis = useCallback(async () => {
    await queryClient.cancelQueries({
      predicate: ({ queryKey }) => queryKey.includes(widgetSlug),
      fetchStatus: 'fetching',
    });
  }, [queryClient]);

  const { data, isFetching, isError, refetch } = useMangroveBlueCarbon(
    {},
    { enabled: !isCanceled },
    handleQueryCancellation
  );

  const handleTryAgain = useCallback(async () => {
    await refetch();
    setIsCanceled(false);
  }, [refetch]);

  const { location, agb, toc, soc, config, noData } = data;

  if (noData) return null;

  return (
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
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
      {data && !isFetching && !isError && !isCanceled && (
        <div className="space-y-4">
          <p className={WIDGET_SENTENCE_STYLE}>
            Total organic carbon stored in <span className="font-bold"> {location}</span> mangroves
            is estimated at <span className="font-bold"> {toc}t CO₂e</span> with{' '}
            <span className="font-bold"> {agb}t CO₂e</span> stored in above-ground biomass and{' '}
            <span className="font-bold"> {soc}t CO₂e</span> stored in the upper 1m of soil.
          </p>
          <BlueCarbonChart config={config} legend={config.legend} />
          <p className="text-sm italic">
            Note: This information is based on an outdated GMW version. Please use for reference
            only while we are in the process of updating this to the latest GMW version 3.
          </p>
        </div>
      )}
    </div>
  );
};

export default BlueCarbonWidget;
