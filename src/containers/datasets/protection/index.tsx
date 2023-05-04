import { currentLocationAtom } from 'store/location';
import { widgetYearAtom } from 'store/widget';

import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil';

import { useLocation } from 'containers/datasets/locations/hooks';

import { useMangroveProtectedAreas } from './hooks';

const NetChange = () => {
  const currentLocationId = useRecoilValue(currentLocationAtom);
  const currentYear = useRecoilValue(widgetYearAtom);
  const { data } = useLocation(currentLocationId);
  const { name, location_id } = data;

  const { data: data2 } = useMangroveProtectedAreas({
    ...(!!location_id || (location_id !== 'worldwide' && { location_id })),
    year: currentYear,
  });
  return (
    <div>
      <p>
        Mangroves found in protected areas <span className="font-bold">{name} </span> in{' '}
        {currentYear} represented 6,128,720.38
        {'ha unit selector'}
        out of a total 14,735,899.10
        {'ha unit selector'}.
      </p>
    </div>
  );
};

export default NetChange;
