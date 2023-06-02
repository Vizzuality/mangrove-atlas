import Loading from 'components/loading';
import { WIDGET_CARD_WRAPER_STYLE } from 'styles/widgets';

import HeightChart from './chart';
import { useAnalysis, useMangroveHeight } from './hooks';

const HeightWidget = () => {
  const { location, legend, isLoading, mean, unit, year, config, isPlaceholderData, isFetched } =
    useMangroveHeight();

  const { data: analysisData } = useAnalysis();

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
            Mean mangrove maximum canopy height in <span className="font-bold"> {location}</span>{' '}
            was{' '}
            <span className="font-bold">
              {' '}
              {mean} {unit}
            </span>{' '}
            in <span className="font-bold"> {year}</span>.
          </p>
          <HeightChart config={config} legend={legend} />
        </div>
      )}
    </div>
  );
};

export default HeightWidget;
