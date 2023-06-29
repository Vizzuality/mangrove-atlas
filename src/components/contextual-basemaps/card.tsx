import { useMemo, ReactElement } from 'react';

import Image, { StaticImageData } from 'next/image';

import cn from 'lib/classnames';

import { basemapAtom } from 'store/map';
import { basemapContextualAtom } from 'store/map-settings';

import { useRecoilState } from 'recoil';

import { INFO } from 'containers/datasets';
import type { BasemapId } from 'containers/datasets/contextual-layers/basemaps';

import { Checkbox, CheckboxIndicator } from 'components/checkbox';
import Icon from 'components/icon';
import Info from 'components/widget-controls/info';
import { WIDGET_CARD_WRAPPER_STYLE } from 'styles/widgets';
import type { ContextualBasemapsId, MosaicId } from 'types/widget';

import analyticThumb from 'images/thumbs/analytic.png';
import darkThumb from 'images/thumbs/btn-dark@2x.png';
import lightThumb from 'images/thumbs/btn-light@2x.png';
import satelliteThumb from 'images/thumbs/btn-satellite@2x.png';
import visualThumb from 'images/thumbs/visual.png';

import TICK_SVG from 'svgs/ui/tick.svg?sprite';

import DateSelect from './date-select';

const THUMBS = {
  light: lightThumb as StaticImageData,
  dark: darkThumb as StaticImageData,
  satellite: satelliteThumb as StaticImageData,
  planet_medres_analytic_monthly: analyticThumb as StaticImageData,
  planet_medres_visual_monthly: visualThumb as StaticImageData,
};

type CardBasemapContextualProps = {
  id: BasemapId | ContextualBasemapsId;
  mosaic_id?: MosaicId;
  type: 'contextual' | 'basemap';
  name: string;
  description?: string;
  thumb?: string;
  hasDropdown?: boolean;
};

const CardBasemapContextual = ({
  id,
  mosaic_id,
  type,
  name,
  description,
  hasDropdown,
}: CardBasemapContextualProps) => {
  const [basemapStored, setBasemap] = useRecoilState(basemapAtom);
  const [basemapContextualSelected, setBasemapContextual] = useRecoilState(basemapContextualAtom);
  const isActive = useMemo(() => {
    if (type === 'contextual') return basemapContextualSelected === id;
    if (type === 'basemap') return basemapStored === id;
  }, [basemapContextualSelected, basemapStored, id]);
  const info = INFO[id];

  const handleClick = () => {
    if (type === 'contextual') {
      const updatedContextualBasemap = basemapContextualSelected === id ? null : id;
      setBasemapContextual(updatedContextualBasemap as ContextualBasemapsId);
    }

    if (type === 'basemap') {
      setBasemap(id as BasemapId);
    }
  };
  return (
    <div className="w-full border-b-2 border-dashed border-b-brand-800 border-opacity-50 last-of-type:border-none">
      <div className="flex w-full items-center justify-between">
        <h2 className="flex-1 cursor-pointer py-1 text-xs font-bold uppercase -tracking-tighter text-black/85">
          {name}
        </h2>

        {!!info && <Info id={id} content={false} />}
      </div>

      <div className={`${WIDGET_CARD_WRAPPER_STYLE} flex`}>
        <button
          type="button"
          onClick={handleClick}
          className={cn({
            [`relative mr-10 h-24 w-24  shrink-0 rounded-xl border-4 border-transparent bg-cover bg-center`]:
              true,
            'border-brand-800': isActive,
          })}
        >
          <Image src={THUMBS[id]} alt={name} fill className="rounded-lg shadow-soft" />

          <Checkbox
            className={cn({
              'absolute bottom-2 right-2 h-6 w-6 rounded-full border-none': true,
            })}
            checked={isActive}
          >
            <CheckboxIndicator className="text-white">
              <Icon icon={TICK_SVG} className="h-full w-full fill-current text-white" />
            </CheckboxIndicator>
          </Checkbox>
        </button>

        <div>
          <h4>{name}</h4>
          {description && <p>{description}</p>}
        </div>
      </div>
      {isActive && hasDropdown && (
        <div className="pb-4">
          <DateSelect mosaic_id={mosaic_id} id={id} />
        </div>
      )}
    </div>
  );
};

export default CardBasemapContextual;
