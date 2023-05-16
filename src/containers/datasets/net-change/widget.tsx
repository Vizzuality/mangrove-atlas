import { useRouter } from 'next/router';

import { widgetYearAtom } from 'store/widgets';

import { useRecoilValue } from 'recoil';

import { useLocation } from 'containers/datasets/locations/hooks';

import NetChangeChart from './chart';
import { useMangroveNetChange } from './hooks';

const NetChangeWidget = () => {
  const currentYear = useRecoilValue(widgetYearAtom);
  const {
    query: { locationType, id },
  } = useRouter();
  const {
    data: { name, id: currentLocation, location_id },
  } = useLocation(locationType, id);

  const { isLoading, netChange, direction, config } = useMangroveNetChange(
    {
      ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
      year: currentYear,
    },
    {}
  );
  if (isLoading) return null;
  return (
    <div>
      {isLoading && <div>...loading</div>}
      {!isLoading && (
        <div>
          <p>
            The extent of mangroves in <span className="font-bold"> {name}</span> has{' '}
            <span className="font-bold"> {direction}</span> by{' '}
            <span className="font-bold"> {netChange}</span> {'km² unit select'} between{' '}
            {'1996 start date select'}y{'2020 end date select'}.
          </p>
          <NetChangeChart config={config} />
        </div>
      )}
    </div>
  );
};

export default NetChangeWidget;
