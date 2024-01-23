import NoData from 'containers/widgets/no-data';

import Loading from 'components/loading';
import { WIDGET_CARD_WRAPPER_STYLE, WIDGET_SENTENCE_STYLE } from 'styles/widgets';

import SpeciesThreatenedChart from './chart';
import { useMangroveSpecies } from './hooks';

const SpeciesThreatened = () => {
  const {
    total,
    threatenedLegend,
    isLoading,
    chartData,
    tooltip,
    location,
    isFetched,
    isPlaceholderData,
  } = useMangroveSpecies();

  if (chartData?.length === 0) return <NoData />;

  return (
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
      <Loading
        visible={(isPlaceholderData || isLoading) && !isFetched}
        iconClassName="flex w-10 h-10 m-auto my-10"
      />
      {isFetched && !isLoading && (
        <div>
          <p className={WIDGET_SENTENCE_STYLE}>
            <span className="font-bold"> {location}</span> has{' '}
            <span className="font-bold"> {total}</span> species of mangroves. Of them,{' '}
            <span className="font-bold">{threatenedLegend}</span> are considered threatened by the
            IUCN Red List.{' '}
          </p>
          <SpeciesThreatenedChart data={chartData} legend={chartData} tooltip={tooltip} />
        </div>
      )}
    </div>
  );
};

export default SpeciesThreatened;
