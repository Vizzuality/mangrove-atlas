import { widgetYearAtom } from 'store/widgets';

import { Imprima } from '@next/font/google';
import { useRecoilValue } from 'recoil';

import Loading from 'components/loading';
import { WIDGET_CARD_WRAPER_STYLE } from 'styles/widgets';

// import HabitatExtentChart from './chart';
import { useMangroveHabitatChange } from './hooks';

const HabitatExtent = () => {
  const currentYear = useRecoilValue(widgetYearAtom);

  const {
    location,
    years,
    unit,
    chartData,
    defaultStartYear,
    defaultEndYear,
    isFetched,
    isPlaceholderData,
  } = useMangroveHabitatChange();

  const isLoading = false;
  const numberOfCountries = 5;
  return (
    <div className={WIDGET_CARD_WRAPER_STYLE}>
      <Loading
        visible={(isPlaceholderData || isLoading) && !isFetched}
        iconClassName="flex w-10 h-10 m-auto my-10"
      />
      {isFetched && !isLoading && (
        <div>
          <p>
            <span className="font-bold"> {location}</span> the {numberOfCountries} countries with
            the largest net change in Mangrove habitat extent between
            <span className="notranslate font-bold">{'1996 start year select'} </span>
            and
            <span className="notranslate font-bold">{'2020 end year select'} </span>
            were:{' '}
          </p>
          {/* <HabitatExtentChart legend={legend} config={config} /> */}
        </div>
      )}
    </div>
  );
};

export default HabitatExtent;
