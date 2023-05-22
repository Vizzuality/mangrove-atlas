import cn from 'lib/classnames';

import { widgetYearAtom } from 'store/widgets';

import { useRecoilValue } from 'recoil';

import Loading from 'components/loading';
import { WIDGET_CARD_WRAPER_STYLE } from 'styles/widgets';

// import HabitatExtentChart from './chart';
import { useMangroveHabitatChange } from './hooks';

const labelsForLayer = [
  {
    color: 'rgba(0,0,0,0.7)',
    label: 'Net change',
  },
  // {
  //   color: '#A6CB10',
  //   label: 'Gain',
  // },
  // {
  //   color: '#EB6240',
  //   label: 'Loss',
  // }, TO - DO - add back when client fixes data for gain and loss
];
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

          <ul className="flex justify-end space-x-4 py-4">
            {labelsForLayer?.map((d) => (
              <li key={`item-${d.label}`} className="inline-flex items-center space-x-2">
                <div
                  className={cn({
                    'h-2 w-4 rounded-r-md': true,
                  })}
                  style={{ backgroundColor: d.color }}
                />
                <span className="text-sm font-bold text-black/85">{d.label}</span>
              </li>
            ))}
          </ul>

          {/* <HabitatExtentChart legend={legend} config={config} /> */}
        </div>
      )}
    </div>
  );
};

export default HabitatExtent;
