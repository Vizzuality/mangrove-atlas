import Loading from 'components/loading';

import RestorationValueChart from './chart';
import { useMangroveEcosystemServices } from './hooks';

const RestorationValue = () => {
  const { isFetched, isFetching, data } = useMangroveEcosystemServices({
    slug: 'restoration-value',
  });
  return (
    <div className="relative">
      <Loading visible={isFetching} iconClassName="flex w-10 h-10 m-auto my-10" />
      {isFetched && data && (
        <div className="space-y-4">
          <h3 className="text-xs">RESTORATION VALUE</h3>
          <p>
            The restoration of mangroves in{' '}
            <span className="font-bold first-letter:uppercase"> {data.location}</span> would
            increase the value of the following ecosystem services:
          </p>
          <div className="flex flex-1 flex-col items-center space-y-2">
            {!!data && <RestorationValueChart data={data} />}
          </div>
        </div>
      )}

      {!isFetching && (
        <div className="absolute bottom-4 -left-10 -right-10 border-2 border-b border-brand-800/30" />
      )}
    </div>
  );
};

export default RestorationValue;
