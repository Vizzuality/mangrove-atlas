import React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import cn from 'lib/classnames';

import {
  useHighlightedPlaces,
  useLocation,
  HIGHLIGHTED_PLACES,
} from 'containers/datasets/locations/hooks';
import type { LocationTypes } from 'containers/datasets/locations/types';

const HighlightedPlaces = ({ onSelectLocation }: { onSelectLocation: () => void }) => {
  const { data } = useHighlightedPlaces();
  const {
    query: { params },
  } = useRouter();
  const locationType = (params?.[0] || 'worldwide') as LocationTypes;
  const id = params?.[1];

  const {
    data: { location_id },
  } = useLocation(id, locationType);

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
              <button
                aria-label={`navigate to highlighted place - ${d.name}`}
                className={cn({
                  'flex h-60 flex-1 rounded-3xl bg-cover bg-center': true,
                  'bg-rufiji': HIGHLIGHTED_PLACES['rufiji'] === d.location_id,
                  'bg-saloum': HIGHLIGHTED_PLACES['saloum'] === d.location_id,
                })}
                onClick={onSelectLocation}
              >
                <h3 className="m-auto flex h-full items-end justify-center pb-4 text-end font-sans text-sm font-bold text-white">
                  {d.name}
                </h3>
              </button>
            </Link>
          );
      })}
      {isHighlightedPlace && (
        <Link href="/" className="flex flex-1">
          <button
            aria-label="Navigate to worldwide"
            className={`flex h-60 flex-1 rounded-3xl bg-[url('/images/highlighted-places/worldwide.jpg')] bg-cover bg-center`}
            onClick={onSelectLocation}
          >
            <h3 className="m-auto flex h-full items-end justify-center pb-4 text-end font-sans text-sm font-bold text-white">
              Worldwide
            </h3>
          </button>
        </Link>
      )}
    </div>
  );
};

export default HighlightedPlaces;
