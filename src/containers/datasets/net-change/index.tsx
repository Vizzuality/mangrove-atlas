import { currentLocationAtom } from 'store/location';
import { widgetYearAtom } from 'store/widget';

import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil';

import { useLocation } from 'containers/datasets/locations/hooks';

import { useMangroveNetChange } from './hooks';

const NetChange = () => {
  const currentLocationId = useRecoilValue(currentLocationAtom);
  const currentYear = useRecoilValue(widgetYearAtom);
  const { data } = useLocation(currentLocationId);
  const { name, location_id } = data;

  const data2 = useMangroveNetChange({
    ...(!!location_id || (location_id !== 'worldwide' && { location_id })),
    year: currentYear,
  });
  return (
    <div>
      <p>
        The extent of mangroves in <span className="font-bold">{name} </span> has decreased by
        5,245.24 {'km² - unitSelect'} between
        {'startDateSelec'}y{'endDateSelect'}.
      </p>
    </div>
  );
};

export default NetChange;
