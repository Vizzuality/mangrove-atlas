import { useCallback, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { trackEvent } from '@/lib/analytics/ga';

import { isNavigatingAtom } from '@/store/map';

import turfBbox from '@turf/bbox';
import { useSetAtom } from 'jotai';
import type { GeoJSONFeature } from 'mapbox-gl';

import { useLocations } from '@/containers/datasets/locations/hooks';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { WIDGET_SUBTITLE_STYLE } from 'styles/widgets';
import type { LocationPopUp } from 'types/map';

const LocationPopUP = ({
  locationPopUpInfo,
  nonExpansible,
}: {
  locationPopUpInfo: {
    info: LocationPopUp | null;
    feature: GeoJSONFeature | null;
  };
  nonExpansible: boolean;
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(nonExpansible);
  const setNavigating = useSetAtom(isNavigatingAtom);

  const router = useRouter();
  const searchParams = useSearchParams();

  const queryParams = searchParams.toString();
  const { info, feature } = locationPopUpInfo;

  const { type, name } = info?.location ?? {};

  const { data: locations } = useLocations();

  const handlePopUpContentVisibility = useCallback(() => {
    // Google Analytics tracking
    trackEvent(`Location pop up - ${isOpen ? 'collapse' : 'expand'}`, {
      category: 'Map Popup iteration',
      action: 'Expand / collapse',
      label: `Location pop up - ${isOpen ? 'collapse' : 'expand'}`,
      value: isOpen ? 'collapse' : 'expand',
    });
    setIsOpen(!isOpen);
  }, [isOpen]);

  const buildNavParams = useCallback(
    (bbox: number[] | null) => {
      const params = new URLSearchParams(queryParams);
      if (bbox) {
        params.set(
          'bounds',
          JSON.stringify([
            [bbox[0], bbox[1]],
            [bbox[2], bbox[3]],
          ])
        );
      }
      const qs = params.toString();
      return qs ? `?${qs}` : '';
    },
    [queryParams]
  );

  const handleClickLocation = useCallback(() => {
    const location_idn = feature?.properties?.location_idn;

    const location = locations?.data?.find((l) => l.location_id === location_idn);

    if (location) {
      const bbox = turfBbox(location.bounds);

      setNavigating(true);
      void router.push(`/country/${location.iso}${buildNavParams(bbox)}`);
    }

    // Google Analytics tracking
    trackEvent(`Location pop up - ${info?.location.name}`, {
      category: 'Map Popup iteration',
      action: 'Click',
      label: `Location pop up - ${info?.location.name}`,
      value: info?.location.name,
    });
  }, [setNavigating, router, buildNavParams, locations, feature, info]);

  const handleClickProtectedArea = useCallback(
    (index: number) => {
      const { ISO3, NAME } = info?.protectedArea?.[index] ?? {};
      const location = locations?.data?.find((l) => {
        return l.iso === ISO3 && l.location_type === 'wdpa' && l.name === NAME;
      });

      if (location) {
        const bbox = turfBbox(location.bounds);

        setNavigating(true);
        void router.push(`/wdpa/${location.location_id}${buildNavParams(bbox)}`);
      }

      // Google Analytics tracking
      trackEvent(`Location pop up, protected area - ${info?.location.name}`, {
        category: 'Map Popup iteration',
        action: 'Click',
        label: `Location pop up, protected area - ${info?.location.name}`,
        value: info?.location.name,
      });
    },
    [setNavigating, router, buildNavParams, locations, info]
  );

  return (
    <Collapsible
      open={nonExpansible ? nonExpansible : isOpen}
      onOpenChange={handlePopUpContentVisibility}
    >
      <CollapsibleTrigger iconType={!nonExpansible ? 'plus-minus' : null} disabled={nonExpansible}>
        <h3 className={WIDGET_SUBTITLE_STYLE}>Analyse an area</h3>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex w-full flex-col space-y-2 border-none px-6 pb-6 font-sans shadow-none">
          <button
            type="button"
            onClick={handleClickLocation}
            className="grid w-full grid-cols-10 gap-4"
          >
            <span className="text-brand-800 col-span-7 text-left text-sm font-semibold">
              {name}
            </span>
            <span className="text-xxs col-span-3 text-left leading-5 font-light text-black/85 uppercase">
              {type}
            </span>
          </button>
        </div>
        {info?.protectedArea &&
          info?.protectedArea?.map(({ NAME }, index) => (
            <button
              key={NAME}
              type="button"
              className="grid w-full cursor-pointer grid-cols-10 gap-4 px-6 pb-6 font-sans"
              onClick={() => handleClickProtectedArea(index)}
            >
              <div className="col-span-7 flex flex-col text-left">
                <span className="text-brand-800 text-sm font-semibold">{NAME}</span>
              </div>
              <span className="text-xxs col-span-3 text-left leading-5 font-light text-black/85 uppercase">
                Protected area
              </span>
            </button>
          ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default LocationPopUP;
