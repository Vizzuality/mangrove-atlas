import { currentLocationAtom } from 'store/location';
import { widgetYearAtom } from 'store/widget';

import { useRecoilValue } from 'recoil';

import { useLocation } from 'containers/datasets/locations/hooks';

import NetChangeChart from './chart';
import { useMangroveNetChange } from './hooks';

const NetChangeWidget = () => {
  const currentLocationId = useRecoilValue(currentLocationAtom);
  const currentYear = useRecoilValue(widgetYearAtom);
  const { data } = useLocation(currentLocationId);
  const { name, location_id } = data;

  const {
    isLoading,
    netChange,
    direction,
    config,
    legend = [],
    tooltip = [],
  } = useMangroveNetChange(
    {
      ...(!!location_id && { location_id }),
      year: currentYear,
    },
    {}
  );
  if (isLoading) return null;
  return (
    <div>
      {isLoading && <div>...loading</div>}
      {!isLoading && (
        <>
          <p>
            The extent of mangroves in <span className="font-bold"> {name}</span> has{' '}
            <span className="font-bold"> {direction}</span> by{' '}
            <span className="font-bold"> {netChange}</span> {'km² unit select'} between{' '}
            {'1996 start date select'}y{'2020 end date select'}.
          </p>
          <NetChangeChart legend={legend} tooltip={tooltip} config={config} />
        </>
      )}
    </div>
  );
};

export default NetChangeWidget;
