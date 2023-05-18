import BiomassChart from './chart';
import { useMangroveBiomass } from './hooks';

const BiomassWidget = () => {
  const { year, mean, unit, config, isLoading, location } = useMangroveBiomass();

  const { legend } = config;
  return (
    <div>
      {isLoading && <div>...loading</div>}
      {!isLoading && (
        <>
          <p>
            Mean mangrove aboveground biomass density in{' '}
            <span className="font-bold"> {location}</span> was{' '}
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
