import Loading from 'components/loading';
import { WIDGET_CARD_WRAPER_STYLE } from 'styles/widgets';

import EmissionsMitigationChart from './chart';
import { useMangroveEmissionsMitigation } from './hooks';
const EmissionsMitigationWidget = () => {
  const { legend, isLoading, location, isPlaceholderData, isFetched, year, config } =
    useMangroveEmissionsMitigation();
  if (isLoading) return null;

  return (
    <div className={WIDGET_CARD_WRAPER_STYLE}>
      <Loading
        visible={(isPlaceholderData || isLoading) && !isFetched}
        iconClassName="flex w-10 h-10 m-auto my-10"
      />
      {isFetched && !isLoading && (
        <div>
          <p>
            Emissions mitigation by area for mangrove and non-mangrove related interventions in the
            world Mean mangrove maximum canopy height in{' '}
            <span className="font-bold"> {location}</span> was{' '}
          </p>
          <EmissionsMitigationChart config={config} legend={legend} />
        </div>
      )}
    </div>
  );
};

export default EmissionsMitigationWidget;
