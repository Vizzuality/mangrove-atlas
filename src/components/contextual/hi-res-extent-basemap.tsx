import { useCallback, useState } from 'react';

import { trackEvent } from '@/lib/analytics/ga';
import cn from '@/lib/classnames';

import { useSyncActiveLayers } from '@/store/layers';

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
        trackEvent('Contextual layer - 2020 high-resolution mangrove extent layer (10m).', {
          category: 'Layers - Contextual',
          action: 'Toggle',
          label: 'Enable Contextual layer - 2020 high-resolution mangrove extent layer (10m).',
        });
      }
    },
    [activeLayers, setActiveLayers]
  );

  return (
    <div className="relative flex flex-col text-sm leading-none text-black/85">
      <RadioGroup onValueChange={handleClick} defaultValue={defaultActive} className="space-y-2">
        <RadioGroupItem
          option={{ value: 'no-layer', label: 'No layer' }}
          data-testid="no-layer"
          labelClassName={cn({
            'cursor-pointer': true,
            'text-brand-800 font-semibold': isActive === 'no-layer',
          })}
        />

        <RadioGroupItem
          option={{
            value: 'hi-res-extent',
            label: '2020 high-resolution mangrove extent layer (10m)',
          }}
          data-testid="hi-res-extent"
          labelClassName={cn({
            'cursor-pointer': true,
            'text-brand-800 font-semibold': isActive === 'hi-res-extent',
          })}
        />
      </RadioGroup>
    </div>
  );
};

export default HighResolutionExtentBasemap;
