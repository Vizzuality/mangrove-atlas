import { useState } from 'react';

import NoData from 'containers/widgets/no-data';

import Chart from 'components/chart';
import Loading from 'components/ui/loading';
import { WIDGET_CARD_WRAPPER_STYLE, WIDGET_SENTENCE_STYLE } from 'styles/widgets';

import { useMangroveEmissionsMitigation } from './hooks';
import Legend from './legend';
import { trackEvent } from 'lib/analytics/ga';

const EmissionsMitigationWidget = () => {
  const [filteredIndicators, setFilteredIndicators] = useState([]);
  const { isLoading, data, isPlaceholderData, isFetched } = useMangroveEmissionsMitigation({
    filteredIndicators,
  });

  const handleChartBars = (indicator, filteredIndicators, setFilteredIndicators) => {
    const index = filteredIndicators.indexOf(indicator);
    if (index === -1) {
      setFilteredIndicators([...filteredIndicators, indicator]);
      // Google Analytics tracking
      trackEvent('Widget iteration - filter change in emissions mitigation', {
        action: 'Widget iteration - filter change in emissions mitigation',
        label: `Widget iteration - emissions mitigation add ${indicator} filter`,
      });
    } else {
      // Google Analytics tracking
      trackEvent('Widget iteration - filter change in emissions mitigation', {
        action: 'Widget iteration - filter change in emissions mitigation',
        label: `Widget iteration - emissions mitigation remove ${indicator} filter`,
      });
      const filter = filteredIndicators.splice(index, 1);
      const updatedIndicators = filteredIndicators.filter((indicator) => indicator !== filter);
      setFilteredIndicators(updatedIndicators);
    }
  };
  const { config, location, noData } = data;
  const { legend, ...restConfig } = config;

  if (noData) return <NoData />;

  return (
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
      <Loading
        visible={(isPlaceholderData || isLoading) && !isFetched}
        iconClassName="flex w-10 h-10 m-auto my-10"
      />
      {isFetched && !isLoading && (
        <div>
          <p className={WIDGET_SENTENCE_STYLE}>
            Emissions mitigation by area for mangrove and non-mangrove related interventions in the
            <span className="font-bold"> {location}</span>.
          </p>
          <div className="flex flex-1 items-center justify-between py-10">
            <Chart config={restConfig} />
            <Legend
              items={legend}
              onClick={handleChartBars}
              filteredIndicators={filteredIndicators}
              setFilteredIndicators={setFilteredIndicators}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmissionsMitigationWidget;
