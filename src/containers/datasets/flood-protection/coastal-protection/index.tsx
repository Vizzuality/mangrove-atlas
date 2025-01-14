import { useRouter } from 'next/router';

import { cn } from 'lib/classnames';

import { useLocation } from 'containers/datasets/locations/hooks';
import { LocationTypes } from 'containers/datasets/locations/types';

import { WIDGET_CARD_WRAPPER_STYLE, WIDGET_SENTENCE_STYLE } from 'styles/widgets';

const CoastalProtection = () => {
  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0] as LocationTypes;
  const id = queryParams?.[1];
  const {
    data: { name: location },
  } = useLocation(id, locationType);
  return (
    <div
      className={cn({
        [WIDGET_CARD_WRAPPER_STYLE]: true,
        relative: true,
      })}
    >
      <div className="space-y-4">
        <p className={WIDGET_SENTENCE_STYLE}>
          In <span className="font-bold"> {location}</span>, mangroves are protecting the coast
          against flood caused from different type of storms.
        </p>
      </div>
    </div>
  );
};

export default CoastalProtection;
