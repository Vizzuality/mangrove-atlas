import React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import cn from 'lib/classnames';

import {
  useHighlightedPlaces,
  useLocation,
  HIGHLIGHTED_PLACES,
} from 'containers/datasets/locations/hooks';

const HighlightedPlaces = () => {
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

  return (
    <div className="flex justify-between space-x-6">
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
                  'flex h-60 flex-1 rounded-3xl bg-cover bg-center': true,
                  'bg-rufiji': HIGHLIGHTED_PLACES['rufiji'] === d.location_id,
                  'bg-saloum': HIGHLIGHTED_PLACES['saloum'] === d.location_id,
                })}
              >
                <h3 className="m-auto flex h-full items-end justify-center pb-4 text-end font-sans text-sm font-bold text-white">
                  {d.name}
                </h3>
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

export default HighlightedPlaces;
