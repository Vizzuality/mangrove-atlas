import { useCallback, useState } from 'react';

import { trackEvent } from '@/lib/analytics/ga';
import cn from '@/lib/classnames';

import { useSyncActiveLayers } from '@/store/layers';

import { HIGH_RESOLUTION_EXTENT } from '@/containers/datasets/contextual-layers/constants';

import RadioGroup from '@/components/ui/radio-group';
import RadioGroupItem from '@/components/ui/radio-group/radio-group-item';
import type { Layer } from 'types/layers';
import type { ContextualBasemapsId } from 'types/widget';

const HighResolutionExtentBasemap = () => {
  const [activeLayers, setActiveLayers] = useSyncActiveLayers();
  const defaultActive =
    activeLayers?.find((layer) => layer.id === 'hi-res-extent')?.id || 'no-layer';
  const [isActive, setIsActive] = useState(defaultActive);

  const handleClick = useCallback(
    (id) => {
      setIsActive(id);
      const layersUpdate =
        id === 'no-layer'
          ? activeLayers?.filter((w) => w.id !== 'hi-res-extent')
          : ([
              {
                id: 'hi-res-extent' as ContextualBasemapsId,
                opacity: '1',
                visibility: 'visible',
              },
              ...activeLayers,
            ] as Layer[]);
      setActiveLayers(layersUpdate);

      // Google Analytics tracking
      if (id !== 'no-layer') {
        trackEvent('Contextual layer high resolution extent layer', {
          category: 'Layers - Contextual',
          action: 'Toggle',
          label: 'Enable Contextual layer high resolution extent layer',
        });
      }
    },
    [activeLayers, setActiveLayers]
  );

  return (
    <div className="relative flex flex-col text-sm leading-none text-black/85">
      <RadioGroup onValueChange={handleClick} defaultValue={defaultActive} className="space-y-2">
        {/* The option text is rendered by RadioGroupItem, inside the radio
            button itself. A sibling <label htmlFor> cannot name a Radix radio
            (it renders a <button>, which is not labelable), so these radios
            previously had no accessible name and the text was not clickable. */}
        <RadioGroupItem
          option={{ value: 'no-layer', label: 'No layer' }}
          data-testid="no-layer"
          labelClassName={cn({
            'cursor-pointer': true,
            'text-brand-800 font-semibold': isActive === 'no-layer',
          })}
        />

        {HIGH_RESOLUTION_EXTENT.map(({ id, name }) => {
          return (
            <RadioGroupItem
              key={id}
              option={{ value: id, label: name }}
              data-testid={id}
              labelClassName={cn({
                'cursor-pointer': true,
                'text-brand-800 font-semibold': isActive === id,
              })}
            />
          );
        })}
      </RadioGroup>
    </div>
  );
};

export default HighResolutionExtentBasemap;
