import { useRouter } from 'next/router';

import { widgetYearAtom } from 'store/widgets';

import { useRecoilValue } from 'recoil';

import { useLocation } from 'containers/datasets/locations/hooks';

import HeightChart from './chart';
import { useMangroveHeight } from './hooks';

const NetChangeWidget = () => {
  const currentYear = useRecoilValue(widgetYearAtom);
  const {
    query: { params },
  } = useRouter();
  const locationType = params?.[0];
  const id = params?.[1];
  const {
    data: { name, id: currentLocation, location_id },
  } = useLocation(locationType, id);

  const { isLoading, mean, unit, year, config } = useMangroveHeight(
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
            Mean mangrove maximum canopy height in <span className="font-bold"> {name}</span> was{' '}
            <span className="font-bold">
              {' '}
              {mean} {unit}
            </span>{' '}
            in <span className="font-bold"> {year}</span>.
          </p>
          <HeightChart config={config} />
        </div>
      )}
    </div>
  );
};

export default NetChangeWidget;
