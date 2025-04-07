import cn from 'lib/classnames';

import { useMangroveRestoration } from 'containers/datasets/restoration/overview/hooks';

import Loading from 'components/ui/loading';
import {
  WIDGET_CARD_WRAPPER_STYLE,
  WIDGET_SENTENCE_STYLE,
  WIDGET_SUBTITLE_STYLE,
} from 'styles/widgets';

import RestorableAreasChart from './chart';
const RestorableAreas = () => {
  const { isLoading, isFetched, isFetching, data } = useMangroveRestoration();
  if (!data) return null;
  return (
    <div
      className={cn({
        [WIDGET_CARD_WRAPPER_STYLE]: true,
        relative: true,
      })}
    >
      <Loading visible={isFetching} iconClassName="flex w-10 h-10 m-auto my-10" />
      {isFetched && !isLoading && (
        <div className="space-y-4">
          <h3 className={WIDGET_SUBTITLE_STYLE}>RESTORABLE MANGROVE AREA</h3>
          <p className={WIDGET_SENTENCE_STYLE}>
            <span className="font-bold first-letter:uppercase"> {data.location}</span> restorable
            mangrove areas represent{' '}
            <span className="whitespace-nowrap font-bold">{data.restorable_area_perc} %</span> of
            the total mangrove area.
          </p>
          <div className="flex flex-1 flex-col items-center space-y-2">
            {!!data && <RestorableAreasChart data={data} />}
          </div>
        </div>
      )}
      <div className="absolute bottom-4 -left-10 -right-10 border-2 border-b border-brand-800/30" />
    </div>
  );
};

export default RestorableAreas;
