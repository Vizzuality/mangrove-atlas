import { currentLocationAtom } from 'store/location';
import { widgetYearAtom } from 'store/widget';

import { useRecoilValue } from 'recoil';

import { useLocation } from 'containers/datasets/locations/hooks';

import HabitatExtentChart from './chart';
import { useMangroveHabitatExtent } from './hooks';

const HabitatExtent = () => {
  const currentLocationId = useRecoilValue(currentLocationAtom);
  const currentYear = useRecoilValue(widgetYearAtom);
  const { data } = useLocation(currentLocationId);
  const { name, location_id } = data;

  const { area, mangroveCoastCoveragePercentage, totalLength, legend } = useMangroveHabitatExtent({
    ...(!!location_id || (location_id !== 'worldwide' && { location_id })),
    year: currentYear,
  });

  return (
    <div>
      <p>
        The area of mangrove habitat in <span className="font-bold"> {name}</span> was{' '}
        <span className="notranslate font-bold">{area} </span>
        {'unitSelector'}
        in
        {'yearSelector'}, this represents a linear coverage of{' '}
        <span className="font-bold">{mangroveCoastCoveragePercentage}%</span> of the
        <span className="notranslate font-bold"> {totalLength} km</span> of the coastline.
      </p>
      <HabitatExtentChart
        data={[
          { color: '#06C4BD', value: 14760535 },
          { color: '#ECECEF', value: 181985304 },
        ]}
        legend={legend}
      />
    </div>
  );
};

export default HabitatExtent;
