import Loading from 'components/loading';
import { WIDGET_CARD_WRAPER_STYLE } from 'styles/widgets';

import BlueCarbonChart from './chart';
import { useMangroveBlueCarbon } from './hooks';

const BlueCarbonWidget = () => {
  const { data, isLoading, isPlaceholderData, isFetched } = useMangroveBlueCarbon();
  const { location, agb, toc, soc, config } = data;
  const { legend } = config;
  return (
    <div className={WIDGET_CARD_WRAPER_STYLE}>
      <Loading
        visible={(isPlaceholderData || isLoading) && !isFetched}
        iconClassName="flex w-10 h-10 m-auto my-10"
      />
      {isFetched && !isLoading && (
        <div className="space-y-4">
          <p>
            Total organic carbon stored in <span className="font-bold"> {location}</span> mangroves
            is estimated at <span className="font-bold"> {toc}t CO₂e</span> with{' '}
            <span className="font-bold"> {agb}t CO₂e</span> stored in above-ground biomass and{' '}
            <span className="font-bold"> {soc}t CO₂e</span> stored in the upper 1m of soil.
          </p>
          <BlueCarbonChart config={config} legend={legend} />
          <p className="text-sm italic">
            Note: This information is based on an outdated GMW version. Please use for reference
            only while we are in the process of updating this to the latest GMW version 3.
          </p>
        </div>
      )}
    </div>
  );
};

export default BlueCarbonWidget;
