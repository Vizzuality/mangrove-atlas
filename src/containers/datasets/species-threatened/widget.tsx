import { currentLocationAtom } from 'store/location';

import { useRecoilValue } from 'recoil';

import { useLocation } from 'containers/datasets/locations/hooks';

import SpeciesThreatenedChart from './chart';
import { useMangroveSpecies } from './hooks';

const SpeciesThreatened = () => {
  const currentLocationId = useRecoilValue(currentLocationAtom);
  const { data: location } = useLocation(currentLocationId);
  const { name, location_id } = location;
  const { total, threatenedLegend, isLoading, chartData, tooltip } = useMangroveSpecies(
    {
      location_id,
    },
    {}
  );

  if (!chartData) return null;
  return (
    <>
      <div>
        {!isLoading && (
          <>
            <p className="text-lg font-light text-black/85">
              <span className="font-bold"> {name}</span> has{' '}
              <span className="font-bold"> {total}</span> species of mangroves. Of them,{' '}
              <span className="font-bold">{threatenedLegend}</span> are considered threatened by the
              IUCN Red List.{' '}
            </p>
            <SpeciesThreatenedChart data={chartData} legend={chartData} tooltip={tooltip} />
          </>
        )}
      </div>
    </>
  );
};

export default SpeciesThreatened;
