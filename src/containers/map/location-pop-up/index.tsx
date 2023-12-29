import { useState, useCallback } from 'react';

import { useRouter } from 'next/router';

import cn from 'lib/classnames';

import { locationBoundsAtom } from 'store/map';

import turfBbox from '@turf/bbox';
import { AnimatePresence, motion } from 'framer-motion';
import type { MapboxGeoJSONFeature } from 'mapbox-gl';
import { useRecoilState } from 'recoil';

import { useLocations } from 'containers/datasets/locations/hooks';

import { WIDGET_SUBTITLE_STYLE } from 'styles/widgets';
import type { LocationPopUp } from 'types/map';

const LocationPopUP = ({
  locationPopUpInfo,
}: {
  locationPopUpInfo: {
    info: LocationPopUp;
    feature: MapboxGeoJSONFeature;
  };
}) => {
  const [open, setOpen] = useState(false);
  const [locationBounds, setLocationBounds] = useRecoilState(locationBoundsAtom);
  const handleClick = useCallback(() => {
    setOpen(!open);
  }, [open]);
  const { push, asPath } = useRouter();

  const queryParams = asPath.split('?')[1];
  const { info, feature } = locationPopUpInfo;
  const { type, name } = info;
  const { data: locations } = useLocations();

  const handleClickLocation = useCallback(() => {
    const {
      properties: { location_idn },
    } = feature;

    const location = locations.data?.find((l) => l.location_id === location_idn);

    if (location) {
      const bbox = turfBbox(location.bounds);

      if (bbox) {
        setLocationBounds(bbox as typeof locationBounds);
      }

      push(`/country/${location.iso}/${queryParams ? `?${queryParams}` : ''}`, null);
    }
  }, [setLocationBounds, push, queryParams, locations]);

  return (
    <div
      className={cn({
        'box-border flex w-full cursor-pointer flex-col items-start border-t border-slate-100 p-6 font-sans':
          true,
        'max-h-[72px] w-full overflow-hidden': !open,
      })}
    >
      <div className="flex w-full items-center justify-between pb-6" onClick={handleClick}>
        <span className="m-0 text-sm font-semibold">
          <h3 className={WIDGET_SUBTITLE_STYLE}>Analyse an area</h3>
        </span>
        <span
          className={cn({
            'text-brand-800': true,
            'text-5xl': open,
            'text-3xl': !open,
          })}
        >
          {open ? '-' : '+'}
        </span>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="flex w-full grow flex-col items-center justify-between">
              <span>{type}</span>
              <button type="button" onClick={handleClickLocation}>
                {name}
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationPopUP;
