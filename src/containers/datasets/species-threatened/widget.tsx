import SpeciesThreatenedChart from './chart';
import { useMangroveSpecies } from './hooks';

const SpeciesThreatened = () => {
  const { total, threatenedLegend, isLoading, chartData, tooltip, location } = useMangroveSpecies();

  if (!chartData) return null;
  return (
    <>
      <div>
        {!isLoading && (
          <div>
            <p className="text-lg font-light text-black/85">
              <span className="font-bold"> {location}</span> has{' '}
              <span className="font-bold"> {total}</span> species of mangroves. Of them,{' '}
              <span className="font-bold">{threatenedLegend}</span> are considered threatened by the
              IUCN Red List.{' '}
            </p>
            <SpeciesThreatenedChart data={chartData} legend={chartData} tooltip={tooltip} />
          </div>
        )}
      </div>
    </>
  );
};

export default SpeciesThreatened;
