import { useRouter } from 'next/router';

import { widgetYearAtom } from 'store/widgets';

import { useRecoilValue } from 'recoil';

import { useLocation } from 'containers/datasets/locations/hooks';

// import HabitatExtentChart from './chart';
import { useMangroveHabitatChange } from './hooks';

const HabitatExtent = () => {
  const currentYear = useRecoilValue(widgetYearAtom);
  const {
    query: { params },
  } = useRouter();
  const locationType = params?.[0];
  const id = params?.[1];
  const {
    data: { name, id: currentLocation, location_id },
  } = useLocation(locationType, id);

  const { years, unit, chartData, defaultStartYear, defaultEndYear } = useMangroveHabitatChange(
    {
      ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
      year: currentYear,
    },
    {}
  );

  const isLoading = false;
  const numberOfCountries = 5;
  return (
    <div>
      {isLoading ? (
        <div>...loading</div>
      ) : (
        <div>
          <p>
            <span className="font-bold"> {name}</span> the {numberOfCountries} countries with the
            largest net change in Mangrove habitat extent between
            <span className="notranslate font-bold">{'1996 start year select'} </span>
            and
            <span className="notranslate font-bold">{'2020 end year select'} </span>
            were:{' '}
          </p>
          {/* <HabitatExtentChart legend={legend} config={config} /> */}
        </div>
      )}
    </div>
  );
};

export default HabitatExtent;
