import { createRef, useState, useLayoutEffect } from 'react';

import cn from 'lib/classnames';

import Icon from 'components/icon';
import Loading from 'components/loading';
import { WIDGET_CARD_WRAPER_STYLE } from 'styles/widgets';

import TRIANGLE_SVG from 'svgs/ui/triangle.svg?sprite';

import { useMangroveSpecies } from './hooks';

const SpeciesDistribution = () => {
  const [lineChartWidth, setLineChartWidth] = useState(0);

  const {
    noData,
    location,
    total,
    legend,
    worldwideTotal,
    isLoading,
    isFetched,
    isPlaceholderData,
  } = useMangroveSpecies();
  const isWorldwide = location === 'Worldwide';
  // const total = data?.total;
  const ref = createRef<HTMLDivElement>();
  const trianglePosition = (total * lineChartWidth) / worldwideTotal - 11; // substract icon size
  // fires synchronously after all DOM mutations.
  useLayoutEffect(() => {
    if (ref && ref.current && ref.current.offsetWidth) {
      setLineChartWidth(ref?.current?.offsetWidth);
    }
  }, [ref]);

  if (noData) return null;
  return (
    <div className={WIDGET_CARD_WRAPER_STYLE}>
      <Loading
        visible={(isPlaceholderData || isLoading) && !isFetched}
        iconClassName="flex w-10 h-10 m-auto my-10"
      />
      {isFetched && !isLoading && (
        <div className="pb-8">
          {/* mangrove sentence styles, create constant */}
          <p className="text-lg font-light text-black/85 first-letter:uppercase">
            <span className="font-bold"> {location}</span> has{' '}
            <span className="font-bold">{total}</span> species of mangroves distributed by country
            as map shows.
          </p>
          <div className="relative w-full font-sans text-sm text-black/85 ">
            <p className="w-full text-end opacity-50">total species</p>

            <div
              ref={ref}
              className={cn({
                'relative  h-7 w-full': true,
                'my-2.5': isWorldwide,
                'mt-8 mb-2.5': !isWorldwide,
              })}
              style={{
                background:
                  'linear-gradient(90deg, #F9FDB7 0%, #E0F1B2 10.22%, #C7E6AC 21.09%, #B0DAA9 32.17%, #99CFA6 43.48%, #7CBCA2 55.87%, #59A29C 67.83%, #3B8793 78.7%, #2D6D82 88.48%, #205272 99.99%, #205272 100%)',
              }}
            >
              {!isWorldwide && (
                <Icon
                  icon={TRIANGLE_SVG}
                  className="absolute -top-7 h-5 w-5"
                  style={{ left: !!trianglePosition && trianglePosition }}
                />
              )}
            </div>
            <div className="flex w-full justify-between">
              {legend.map((l) => (
                <p key={l}>{l}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeciesDistribution;
