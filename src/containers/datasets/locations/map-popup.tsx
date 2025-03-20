import { useCallback, useState } from 'react';

import { useRouter } from 'next/router';

import { locationBoundsAtom } from 'store/map';

import turfBbox from '@turf/bbox';
import type { MapboxGeoJSONFeature } from 'mapbox-gl';
import { useRecoilState } from 'recoil';

import { useLocations } from 'containers/datasets/locations/hooks';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from 'components/ui/collapsible';
import { WIDGET_SUBTITLE_STYLE } from 'styles/widgets';
import type { LocationPopUp } from 'types/map';

const LocationPopUP = ({
  locationPopUpInfo,
  nonExpansible,
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
  const [isOpen, setIsOpen] = useState(nonExpansible);
  const [locationBounds, setLocationBounds] = useRecoilState(locationBoundsAtom);

  const { push, asPath } = useRouter();

  const queryParams = asPath.split('?')[1];
  const { info, feature } = locationPopUpInfo;

  const { type, name } = info.location;

  const { data: locations } = useLocations();

  const handlePopUpContentVisibility = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

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

      void push(`/country/${location.iso}/${queryParams ? `?${queryParams}` : ''}`, null);
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
        void push(`/wdpa/${location.location_id}/${queryParams ? `?${queryParams}` : ''}`, null);
        onClose();
      }
    },
    [setLocationBounds, push, queryParams, locations, info, onClose]
  );

  return (
    <Collapsible
      open={nonExpansible ? nonExpansible : isOpen}
      onOpenChange={handlePopUpContentVisibility}
    >
      <CollapsibleTrigger showExpandIcon={!nonExpansible} disabled={nonExpansible}>
        <h3 className={WIDGET_SUBTITLE_STYLE}>Analyse an area</h3>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex w-full flex-col space-y-2 border-none px-6 pb-6 font-sans shadow-none">
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
      </CollapsibleContent>
    </Collapsible>
  );
};

export default LocationPopUP;
