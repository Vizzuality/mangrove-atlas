import DriversChangeChart from 'containers/datasets/drivers-change/chart';
import { primaryDrivers } from 'containers/datasets/drivers-change/constants';
import { useMangroveDriversChange } from 'containers/datasets/drivers-change/hooks';
import NoData from 'containers/widgets/no-data';

import Loading from 'components/ui/loading';
import { WIDGET_CARD_WRAPPER_STYLE, WIDGET_SENTENCE_STYLE } from 'styles/widgets';

const DriversChangeWidget = () => {
  const { noData, primaryDriver, config, isLoading, location, isFetched, isPlaceholderData } =
    useMangroveDriversChange();

  const { legend } = config;

  if (noData) return <NoData />;

  return (
    primaryDriver && (
      <div className={WIDGET_CARD_WRAPPER_STYLE}>
        <Loading
          visible={(isPlaceholderData || isLoading) && !isFetched}
          iconClassName="flex w-10 h-10 m-auto my-10"
        />
        {isFetched && !isLoading && (
          <>
            <p className={WIDGET_SENTENCE_STYLE}>
              The primary driver of mangrove loss <span className="font-bold"> {location}</span>{' '}
              between 2000 and 2016 was
              <span className="font-bold"> {primaryDrivers[primaryDriver]}</span>.
            </p>

            <DriversChangeChart legend={legend} config={config} />
          </>
        )}
      </div>
    )
  );
};

export default DriversChangeWidget;
