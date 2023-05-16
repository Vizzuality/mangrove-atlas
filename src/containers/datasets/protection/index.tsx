import { useRouter } from 'next/router';

import { widgetYearAtom } from 'store/widgets';

import { useRecoilValue } from 'recoil';

import { useLocation } from 'containers/datasets/locations/hooks';

import { useMangroveProtectedAreas } from './hooks';

const Protection = () => {
  const currentYear = useRecoilValue(widgetYearAtom);
  const {
    query: { locationType, id },
  } = useRouter();
  const {
    data: { name, id: currentLocation, location_id },
  } = useLocation(locationType, id);

  const { data: data2 } = useMangroveProtectedAreas(
    {
      ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
      year: currentYear,
    },
    {}
  );
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

export default Protection;
