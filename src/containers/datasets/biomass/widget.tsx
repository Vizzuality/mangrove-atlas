import { useRouter } from 'next/router';

import { widgetYearAtom } from 'store/widgets';

import { useRecoilValue } from 'recoil';

import { useLocation } from 'containers/datasets/locations/hooks';

import BiomassChart from './chart';
import { useMangroveBiomass } from './hooks';

const BiomassWidget = () => {
  const currentYear = useRecoilValue(widgetYearAtom);
  const {
    query: { params },
  } = useRouter();
  const locationType = params?.[0];
  const id = params?.[1];
  const {
    data: { name, id: currentLocation, location_id },
  } = useLocation(locationType, id);

  const { year, mean, unit, config, isLoading } = useMangroveBiomass(
    {
      ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
      year: currentYear,
    },
    {}
  );

  const { tooltip, legend } = config;

  return (
    <div>
      {isLoading && <div>...loading</div>}
      {!isLoading && (
        <>
          <p>
            Mean mangrove aboveground biomass density in <span className="font-bold"> {name}</span>{' '}
            was{' '}
            <span className="font-bold">
              {mean} {unit}
            </span>{' '}
            in <span className="font-bold"> {year}</span>.
          </p>

          <BiomassChart legend={legend} config={config} />
        </>
      )}
    </div>
  );
};

export default BiomassWidget;
