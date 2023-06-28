import Loading from 'components/loading';
import { WIDGET_CARD_WRAPPER_STYLE, WIDGET_SENTENCE_STYLE } from 'styles/widgets';

import FisheriesChart from './chart';
import { useMangroveFisheries } from './hooks';
const Protection = () => {
  const { data, isFetched, isFetching } = useMangroveFisheries();

  if (!Object.keys(data || {}).length) return null;

  return (
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
      <Loading visible={isFetching && !isFetched} iconClassName="flex w-10 h-10 m-auto my-10" />
      {isFetched && data && (
        <div className="space-y-4">
          <p className={WIDGET_SENTENCE_STYLE}>
            In <span className="font-bold">{data.location} </span>, the median mangrove fishing
            intensity (1) is 3,874 days (ranging from 218 to 360,365).
          </p>
          <FisheriesChart config={data.config} legend={data.legend} />
          <p className="text-sm italic">(1) Fishing intensity: fisher days/km/year </p>
        </div>
      )}
    </div>
  );
};

export default Protection;
