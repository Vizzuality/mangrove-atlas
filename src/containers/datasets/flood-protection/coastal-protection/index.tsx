import cn from '@/lib/classnames';

import { useSyncLocation } from 'hooks/use-sync-location';

import { useLocation } from '@/containers/datasets/locations/hooks';

import { WIDGET_CARD_WRAPPER_STYLE, WIDGET_SENTENCE_STYLE } from 'styles/widgets';

const CoastalProtection = () => {
  const { type: locationType, id } = useSyncLocation();
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
