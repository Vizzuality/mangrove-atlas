import { useMemo } from 'react';

import { usePathname } from 'next/navigation';

import { useSyncActiveLayers } from '@/store/layers';

import { useGetContextualLayerInfo } from '@/containers/layers/hooks';

import type { WidgetSlugType } from 'types/widget';

import Content from './content';
import Controls from './controls';
import Thumb from './thumb';

type ContextualLayersComponentProps = {
  id: string;
  origin?: WidgetSlugType; // Optional prop to track the origin of the suggestion
  description: string;
  position?: 'top' | 'bottom'; // Where the layer lands in the active-layers stack when toggled on
};

const ContextualLayersComponent = ({
  id,
  origin,
  description,
  position = 'bottom',
}: ContextualLayersComponentProps) => {
  const pathname = usePathname();
  const isPrintReport = pathname?.startsWith('/print-report');
  const [activeLayers] = useSyncActiveLayers();
  const isActive = useMemo(() => activeLayers?.some((l) => l.id === id), [activeLayers, id]);

  const info = useGetContextualLayerInfo(id);
  const name = info?.name ?? '';
  const thumbSource = info?.thumbSource;

  // Map tips prompt the reader to switch a layer on — an offer a printed page
  // cannot honour, so the report drops them outright.
  if (isPrintReport) return null;

  return (
    <div className="bg-brand-800/10 relative flex flex-col space-y-5 rounded-2xl p-4">
      <div className="flex items-center justify-between space-x-8">
        <div className="flex items-center">
          <div className="flex items-center space-x-4">
            {!!thumbSource && <Thumb source={thumbSource} name={name} />}

            <Content id={id} description={description} />
          </div>
        </div>
        {!isPrintReport && <Controls id={id} origin={origin} position={position} />}
      </div>
    </div>
  );
};

export default ContextualLayersComponent;
