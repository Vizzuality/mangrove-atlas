import { ReactElement, useMemo } from 'react';

import { activeLayersAtom } from '@/store/layers';

import { useRecoilValue } from 'recoil';

import DateSelect from '@/components/planet-date-select';

const Content = ({
  description,
  id,
}: {
  description: string;
  id: string;
  children?: ReactElement;
}) => {
  const activeLayers = useRecoilValue(activeLayersAtom);
  const isActive = useMemo(
    () => activeLayers?.find((layer) => layer.id.includes('planet_medres_visual_monthly'))?.id,
    [activeLayers]
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-col space-y-1">
        <span className="bg-brand-800 w-fit rounded-[4px] px-2 text-xs font-bold tracking-wider text-white uppercase">
          Map tip
        </span>
        <p className="text-sm font-light">{description}</p>
      </div>
      {id === 'planet_medres_visual_monthly' && isActive && (
        <DateSelect
          mosaic_id="45d01564-c099-42d8-b8f2-a0851accf3e7"
          id="planet_medres_visual_monthly"
          size="sm"
        />
      )}
    </div>
  );
};

export default Content;
