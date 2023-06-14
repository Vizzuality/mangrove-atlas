import React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import cn from 'lib/classnames';

import {
  useHighlightedPlaces,
  useLocation,
  HIGHLIGHTED_PLACES,
} from 'containers/datasets/locations/hooks';

const HighlightedPlacesMobile = () => {
  const { data } = useHighlightedPlaces();
  const {
    query: { params },
  } = useRouter();
  const locationType = params?.[0];
  const id = params?.[1];

  const {
    data: { location_id },
  } = useLocation(locationType, id);
  const isHighlightedPlace = Object.values(HIGHLIGHTED_PLACES).includes(location_id);

  const formatToKm = (mts) => {
    return (mts / 1000).toFixed(1);
  };

  return (
    <div className="flex flex-col justify-between space-y-2.5">
      {data.map((d) => {
        if (location_id !== d.location_id)
          return (
            <Link
              key={d.location_id}
              href={`/${d.location_type}/${d.location_id}`}
              className="flex flex-1"
            >
              <div
                className={cn({
                  'flex h-24 flex-1 flex-col space-y-1.5 rounded-3xl border py-5 px-6': true,
                })}
              >
                <h3 className="flex h-full font-sans text-2lg font-bold text-black/85">{d.name}</h3>
                <div className="flex justify-between">
                  <p>{`${formatToKm(d.coast_length_m)} km coastline`}</p>
                  <p className="font-semibold text-brand-800">View Place</p>
                </div>
              </div>
            </Link>
          );
      })}
      {isHighlightedPlace && (
        <Link href="/" className="flex flex-1">
          <div
            className={`flex h-60 flex-1 rounded-3xl bg-[url('/images/highlighted-places/worldwide.jpg')] bg-cover bg-center`}
          >
            <h3 className="m-auto flex h-full items-end justify-center pb-4 text-end font-sans text-sm font-bold text-white">
              Worldwide
            </h3>
          </div>
        </Link>
      )}
    </div>
  );
};

export default HighlightedPlacesMobile;
