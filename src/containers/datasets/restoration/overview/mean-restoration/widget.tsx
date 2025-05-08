import cn from 'lib/classnames';

import { useMangroveRestoration } from 'containers/datasets/restoration/overview/hooks';

import Loading from 'components/ui/loading';
import {
  WIDGET_CARD_WRAPPER_STYLE,
  WIDGET_SENTENCE_STYLE,
  WIDGET_SUBTITLE_STYLE,
} from 'styles/widgets';

import OverviewChart from './chart';

const MeanRestoration = () => {
  const { isLoading, data, isFetched, isFetching, isError } = useMangroveRestoration();

  if (!data) return null;
  return (
    <div
      className={cn({
        [WIDGET_CARD_WRAPPER_STYLE]: true,
        relative: true,
      })}
    >
      <Loading visible={isLoading || isFetching} iconClassName="flex w-10 h-10 m-auto my-10" />
      {isFetched && !isError && data && (
        <div className="space-y-4">
          <h3 className={WIDGET_SUBTITLE_STYLE}>OVERVIEW</h3>
          <p className={WIDGET_SENTENCE_STYLE}>
            The mean restoration potential score for{' '}
            <span className="font-bold"> {data.location}</span> is{' '}
            <span className="font-bold">{data.restoration_potential_score}</span>
          </p>
          <p>
            This is an indicator of the likely ease for achieving successful restoration, not the
            extent of possible restoration.
          </p>
          <div className="flex flex-1 items-center space-y-2">
            <OverviewChart restoration_potential_score={data.restoration_potential_score} />
          </div>
        </div>
      )}
      {!isLoading && (
        <div className="border-1 absolute bottom-4 -left-10 -right-10 h-0.5 border-b border-dashed border-brand-800 border-opacity-50" />
      )}
    </div>
  );
};

export default MeanRestoration;
