//!TODO: store
import { BiomassYearSettings } from 'store/widgets/biomass';

import { useRecoilState } from 'recoil';

import DriversChangeChart from 'containers/datasets/drivers-change/chart';
import { useMangroveDriversChange } from 'containers/datasets/drivers-change/hooks';

import Loading from 'components/loading';
import { WIDGET_CARD_WRAPER_STYLE } from 'styles/widgets';

const DriversChangeWidget = () => {
  const [defaultYear, setYear] = useRecoilState(BiomassYearSettings);
  const { year, mean, unit, config, isLoading, location, isFetched, isPlaceholderData } =
    useMangroveDriversChange(defaultYear);
  if (year !== defaultYear) setYear(year);
  const { legend } = config;
  return (
    <div className={WIDGET_CARD_WRAPER_STYLE}>
      <Loading
        visible={(isPlaceholderData || isLoading) && !isFetched}
        iconClassName="flex w-10 h-10 m-auto my-10"
      />
      {isFetched && !isLoading && (
        <>
          <p>
            The primary driver of mangrove loss <span className="font-bold"> {location}</span>{' '}
            between 200 and 2016 was{' '}
            <span className="font-bold">
              {mean} {unit}
            </span>{' '}
            in <span className="font-bold"> {year}</span>.
          </p>

          <DriversChangeChart legend={legend} config={config} />
        </>
      )}
    </div>
  );
};

export default DriversChangeWidget;
