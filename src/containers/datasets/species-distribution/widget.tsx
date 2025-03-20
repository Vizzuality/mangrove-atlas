import { useRef } from 'react';

import cn from 'lib/classnames';

import NoData from 'containers/widgets/no-data';

import Icon from 'components/ui/icon';
import Loading from 'components/ui/loading';
import { WIDGET_CARD_WRAPPER_STYLE, WIDGET_SENTENCE_STYLE } from 'styles/widgets';

import TRIANGLE_SVG from 'svgs/ui/triangle.svg?sprite';

import { useMangroveSpecies } from './hooks';

const SpeciesDistribution = () => {
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

  const ref = useRef<HTMLDivElement>(null);
  const lineChartWidth = ref?.current?.offsetWidth || 0;
  const trianglePosition = (total * lineChartWidth) / worldwideTotal - 11; // substract icon size
  // fires synchronously after all DOM mutations.
  // useEffect(() => {
  //   if (ref && ref.current && ref.current.offsetWidth) {
  //     setLineChartWidth(ref?.current?.offsetWidth);
  //   }
  // }, [ref]);

  if (noData) return <NoData />;

  return (
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
      <Loading
        visible={(isPlaceholderData || isLoading) && !isFetched}
        iconClassName="flex w-10 h-10 m-auto my-10"
      />
      <div
        className={cn({
          'w-full pb-8': true,
          invisible: true,
          visible: isFetched && !isLoading,
        })}
      >
        {/* mangrove sentence styles, create constant */}
        <p className={WIDGET_SENTENCE_STYLE}>
          <span className="font-bold"> {location}</span> has{' '}
          <span className="font-bold">{total}</span> species of mangroves distributed by country as
          map shows.
        </p>
        <div className="relative flex flex-1 flex-col font-sans text-sm text-black/85">
          <p className="w-full text-end opacity-50">total species</p>

          <div
            ref={ref}
            className={cn({
              'relative h-7 w-full': true,
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
                style={{ left: trianglePosition ? trianglePosition : 0 }}
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
    </div>
  );
};

export default SpeciesDistribution;
