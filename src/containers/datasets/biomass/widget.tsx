import { BiomassYearSettings } from 'store/widgets/biomass';

import { useRecoilState } from 'recoil';

import Loading from 'components/loading';
import { WIDGET_CARD_WRAPER_STYLE } from 'styles/widgets';

import BiomassChart from './chart';
import { useMangroveBiomass } from './hooks';

const BiomassWidget = () => {
  const [defaultYear, setYear] = useRecoilState(BiomassYearSettings);
  const { year, mean, unit, config, isLoading, location, isFetched, isPlaceholderData } =
    useMangroveBiomass(defaultYear);
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
