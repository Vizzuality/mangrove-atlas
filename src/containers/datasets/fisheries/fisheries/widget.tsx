import NoData from 'containers/widgets/no-data';

import Loading from 'components/ui/loading';
import { WIDGET_SENTENCE_STYLE } from 'styles/widgets';

import FisheriesChart from './chart';
import { useMangroveFisheries } from './hooks';

const Fisheries = () => {
  const { data, isFetched, isFetching } = useMangroveFisheries();

  if (isFetched && !data?.config?.data?.length) return <NoData />;

  return (
    <>
      <Loading visible={isFetching && !isFetched} iconClassName="flex w-10 h-10 m-auto my-10" />
      {isFetched && data && (
        <div className="space-y-4">
          {(!!data.rangeMin || data.rangeMin === 0) &&
            (!!data.rangeMax || data.rangeMax === 0) &&
            !!data.median && (
              <p className={WIDGET_SENTENCE_STYLE}>
                In <span className="font-bold">{data.location} </span>, the median mangrove fishing
                intensity <sup>(1)</sup> is <span className="font-bold">{data.median} days</span>{' '}
                (ranging from {data.rangeMin} to {data.rangeMax}).
              </p>
            )}
          <FisheriesChart config={data.config} />
          <p className="text-sm italic">(1) Fishing intensity: fisher days/km/year </p>
        </div>
      )}
    </>
  );
};

export default Fisheries;
