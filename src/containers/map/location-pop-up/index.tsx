import { useState, useCallback } from 'react';

import { useRouter } from 'next/router';

import cn from 'lib/classnames';

import { locationBoundsAtom } from 'store/map';

import turfBbox from '@turf/bbox';
import { AnimatePresence, motion } from 'framer-motion';
import type { MapboxGeoJSONFeature } from 'mapbox-gl';
import { useRecoilState } from 'recoil';

import { useLocations } from 'containers/datasets/locations/hooks';

import Icon from 'components/icon';
import { WIDGET_SUBTITLE_STYLE } from 'styles/widgets';
import type { LocationPopUp } from 'types/map';

import CLOSE_SVG from 'svgs/ui/close.svg?sprite';

const LocationPopUP = ({
  locationPopUpInfo,
  nonExpansible,
  className,
  onClose,
}: {
  locationPopUpInfo: {
    info: LocationPopUp;
    feature: MapboxGeoJSONFeature;
  };
  nonExpansible: boolean;
  className?: string;
  onClose: () => void;
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
      onClose();
    }
  }, [setLocationBounds, push, queryParams, locations, feature, onClose]);

  const handleClickProtectedArea = useCallback(
    (index: number) => {
      const { ISO3, NAME } = info.protectedArea[index];
      const location = locations.data?.find((l) => {
        return l.iso === ISO3 && l.location_type === 'wdpa' && l.name === NAME;
      });

      if (location) {
        const bbox = turfBbox(location.bounds);

        if (bbox) {
          setLocationBounds(bbox as typeof locationBounds);
        }
        push(`/wdpa/${location.location_id}/${queryParams ? `?${queryParams}` : ''}`, null);
        onClose();
      }
    },
    [setLocationBounds, push, queryParams, locations, info, onClose]
  );
  return (
    <div
      className={cn({
        'relative box-border flex !w-[500px] cursor-pointer flex-col items-start rounded-t-3xl border-t border-slate-100 bg-white p-6 font-sans':
          true,
        [className]: !!className,
      })}
    >
      <button
        className="absolute top-8 -right-[40px] h-11 w-10 cursor-pointer items-center justify-end rounded-r-[20px] bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
        onClick={onClose}
      >
        <Icon icon={CLOSE_SVG} className="ml-1 h-6 w-6" description="Close" />
      </button>
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
            className="mt-4 flex flex-col space-y-2"
          >
            <div className="font-sans">
              <button
                type="button"
                onClick={handleClickLocation}
                className="grid w-full grid-cols-10 gap-4"
              >
                <span className="col-span-7 text-left text-sm font-semibold text-brand-800">
                  {name}
                </span>
                <span className="col-span-3 text-left text-xxs font-light uppercase leading-5 text-black/85">
                  {type}
                </span>
              </button>
            </div>
            {info.protectedArea &&
              info.protectedArea?.map(({ NAME }, index) => (
                <button
                  key={NAME}
                  type="button"
                  className="grid grow cursor-pointer grid-cols-10 gap-4 font-sans"
                  onClick={() => handleClickProtectedArea(index)}
                >
                  <div className="col-span-7 flex flex-col text-left">
                    <span className="text-sm font-semibold text-brand-800">{NAME}</span>
                  </div>
                  <span className="col-span-3 text-left text-xxs font-light uppercase leading-5 text-black/85">
                    Protected area
                  </span>
                </button>
              ))}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationPopUP;
