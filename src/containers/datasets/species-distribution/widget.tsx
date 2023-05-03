import { useRef, useState, useLayoutEffect } from 'react';

import cn from 'lib/classnames';

import { currentLocationAtom } from 'store/location';

import { useRecoilValue } from 'recoil';

import { useLocation } from 'containers/datasets/locations/hooks';

import Icon from 'components/icon';

import TRIANGLE_SVG from 'svgs/ui/triangle.svg?sprite';

import { useMangroveSpecies } from './hooks';

const SpeciesDistribution = () => {
  const [lineChartWidth, setLineChartWidth] = useState(0);

  const currentLocationId = useRecoilValue(currentLocationAtom);
  const { data: location } = useLocation(currentLocationId);
  const { name, location_id } = location;
  const { total, legend, isLoading } = useMangroveSpecies({
    location_id,
  });
  const isWorldwide = location_id === 'worldwide';
  // const total = data?.total;
  const ref = useRef();
  const trianglePosition = (lineChartWidth * total) / 100 - 7; // substract icon size
  // fires synchronously after all DOM mutations.
  useLayoutEffect(() => {
    setLineChartWidth(ref?.current?.offsetWidth);
  }, [ref]);
  return (
    <div>
      {!isLoading && (
        <>
          {/* mangrove sentence styles, create constant */}
          <p className="text-black/85 text-lg font-light">
            <span className="font-bold"> {name}</span> has{' '}
            <span className="font-bold">{total}</span> of mangroves distributed by country as map
            shows.
          </p>
          <div className="text-black/85 relative w-full font-sans text-sm ">
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
        </>
      )}
    </div>
  );
};

export default SpeciesDistribution;
