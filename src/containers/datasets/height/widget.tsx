import { currentLocationAtom } from 'store/location';
import { widgetYearAtom } from 'store/widget';

import { useRecoilValue } from 'recoil';

import { useLocation } from 'containers/datasets/locations/hooks';

import HeightChart from './chart';
import { useMangroveHeight } from './hooks';

const NetChangeWidget = () => {
  const currentLocationId = useRecoilValue(currentLocationAtom);
  const currentYear = useRecoilValue(widgetYearAtom);
  const { data } = useLocation(currentLocationId);
  const { name, location_id } = data;

  const { isLoading, mean, unit, year, config } = useMangroveHeight(
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
        <div>
          <p>
            Mean mangrove maximum canopy height in <span className="font-bold"> {name}</span> was{' '}
            <span className="font-bold">
              {' '}
              {mean} {unit}
            </span>{' '}
            in <span className="font-bold"> {year}</span>.
          </p>
          {/* <HeightChart config={config} /> */}
        </div>
      )}
    </div>
  );
};

export default NetChangeWidget;
