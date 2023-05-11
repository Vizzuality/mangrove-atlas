import { useRouter } from 'next/router';

import { widgetYearAtom } from 'store/widget';

import { useRecoilValue } from 'recoil';

import { useLocation } from 'containers/datasets/locations/hooks';

import HabitatExtentChart from './chart';
import { useMangroveHabitatExtent } from './hooks';

const HabitatExtent = () => {
  const currentYear = useRecoilValue(widgetYearAtom);
  const {
    query: { locationType, id },
  } = useRouter();
  const {
    data: { name, id: location_id },
  } = useLocation(locationType, id);

  const { area, mangroveCoastCoveragePercentage, totalLength, legend, config, isLoading } =
    useMangroveHabitatExtent(
      {
        ...(!!location_id && { location_id }),
        year: currentYear,
      },
      {}
    );

  const { tooltip } = config;
  return (
    <div>
      {isLoading && <div>...loading</div>}
      {!isLoading && (
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
          <HabitatExtentChart legend={legend} config={config} />
        </div>
      )}
    </div>
  );
};

export default HabitatExtent;
