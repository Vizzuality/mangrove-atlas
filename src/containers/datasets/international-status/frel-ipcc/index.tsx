import NoData from 'containers/widgets/no-data';

import Loading from 'components/ui/loading';
import { WIDGET_CARD_WRAPPER_STYLE, WIDGET_SENTENCE_STYLE } from 'styles/widgets';

import { useMangroveInternationalStatus } from './hooks';
const InternationalStatus = () => {
  const {
    location,
    ipcc_wetlands_suplement,
    frel,
    year_frel,
    fow,
    isLoading,
    isFetched,
    isPlaceholderData,
    noData,
  } = useMangroveInternationalStatus();

  const apostrophe = location?.[location?.length - 1] === 's' ? "'" : "'s";

  if (noData) return <NoData />;

  return (
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
      <Loading
        visible={(isPlaceholderData || isLoading) && !isFetched}
        iconClassName="flex w-10 h-10 m-auto my-10"
      />
      {isFetched && !isLoading && (
        <div className="h-full space-y-4">
          {frel && fow && (
            <div className="space-y-4">
              <h3 className="font-bold text-brand-800">Forest Reference Emission Levels</h3>
              <div className="space-y-4">
                <p className={WIDGET_SENTENCE_STYLE}>
                  {location}
                  {apostrophe} {year_frel} FREL is {frel} Mt CO₂e/yr ({location}
                  {apostrophe} mangroves are considered {fow}) .
                </p>
              </div>
            </div>
          )}
          <div className="space-y-4">
            <h3 className="font-bold text-brand-800">IPCC Wetlands Supplement</h3>
            {ipcc_wetlands_suplement === 'has' ? (
              <p className={WIDGET_SENTENCE_STYLE}>
                {location} {ipcc_wetlands_suplement} implemented the IPCC Wetlands Supplement.
              </p>
            ) : (
              <p className={WIDGET_SENTENCE_STYLE}>
                There is no information as to whether {location} has implemented the wetlands
                supplement.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InternationalStatus;
