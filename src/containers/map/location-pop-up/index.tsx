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
  nonExpansible,
  className,
}: {
  locationPopUpInfo: {
    info: LocationPopUp;
    feature: MapboxGeoJSONFeature;
  };
  nonExpansible: boolean;
  className?: string;
}) => {
  const [open, setOpen] = useState(nonExpansible);
  const [locationBounds, setLocationBounds] = useRecoilState(locationBoundsAtom);
  const handleClick = useCallback(() => {
    setOpen(!open);
  }, [open]);
  const { push, asPath } = useRouter();

  const queryParams = asPath.split('?')[1];
  const { info, feature } = locationPopUpInfo;

  const { type, name } = info.location;

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
  }, [setLocationBounds, push, queryParams, locations, feature]);

  // const handleClickProtectedArea = useCallback(() => {
  //   const { ISO3, NAME } = info.protectedArea;
  //   const location = locations.data?.find((l) => {
  //     return l.iso === ISO3 && l.location_type === 'wdpa' && l.name === NAME;
  //   });

  //   if (location) {
  //     const bbox = turfBbox(location.bounds);

  //     if (bbox) {
  //       setLocationBounds(bbox as typeof locationBounds);
  //     }

  //     push(`/wpda/${location.iso}/${queryParams ? `?${queryParams}` : ''}`, null);
  //   }
  // }, [setLocationBounds, push, queryParams, locations, info]);

  return (
    <div
      className={cn({
        'box-border flex !w-[500px] cursor-pointer flex-col items-start rounded-t-3xl border-t border-slate-100 bg-white p-6 font-sans':
          true,
        'max-h-[86px] w-full overflow-hidden': !open,
        [className]: !!className,
      })}
    >
      <button
        className="flex w-full items-center justify-between"
        disabled={nonExpansible}
        onClick={handleClick}
      >
        <span className="m-0 text-sm font-semibold">
          <h3 className={WIDGET_SUBTITLE_STYLE}>Analyse an area</h3>
        </span>
        {!nonExpansible && (
          <span
            className={cn({
              'text-brand-800': true,
              'text-5xl': open,
              'text-3xl': !open,
            })}
          >
            {open ? '-' : '+'}
          </span>
        )}
      </button>
      <AnimatePresence initial={false}>
        {(open || nonExpansible) && (
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
            <div className="flex grow flex-col items-start justify-between font-sans">
              <button type="button" onClick={handleClickLocation} className="space-x-4 text-start">
                <span className="text-sm font-semibold text-brand-800">{name}</span>
                <span className="text-xxs font-light uppercase text-black/85">{type}</span>
              </button>
            </div>
            {info.protectedArea && (
              <div className="flex grow cursor-default flex-col items-start justify-start font-sans">
                <button
                  type="button"
                  // onClick={handleClickProtectedArea}
                  className="space-x-4 text-start"
                >
                  <span className="text-sm font-semibold text-brand-800">
                    {info.protectedArea.NAME}
                  </span>
                  <span className="text-xxs font-light uppercase text-black/85">
                    Protected area
                  </span>
                </button>
                <span className="text-sm font-semibold text-brand-800">
                  {info.protectedArea.ORIG_NAME}
                </span>
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationPopUP;
