import { currentLocationAtom } from 'store/location';
import { widgetYearAtom } from 'store/widget';

import { useRecoilValue } from 'recoil';

import { useLocation } from 'containers/datasets/locations/hooks';

// import HabitatExtentChart from './chart';
import { useMangroveHabitatChange } from './hooks';

const HabitatExtent = () => {
  const currentLocationId = useRecoilValue(currentLocationAtom);
  const currentYear = useRecoilValue(widgetYearAtom);
  const { data } = useLocation(currentLocationId);
  const { name, location_id } = data;

  const { years, unit, chartData, defaultStartYear, defaultEndYear, config } =
    useMangroveHabitatChange(
      {
        ...(!!location_id && { location_id }),
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
