import cn from 'lib/classnames';

import { basemapContextualAtom } from 'store/map-settings';

import { useRecoilState } from 'recoil';

import { CONTEXTUAL_LAYERS_PLANET_SERIES_ATTRIBUTES } from 'containers/datasets/contextual-layers/constants';

import type { ContextualBasemapsId } from 'types/widget';

import DateSelect from './date-select';

const BasemapsMapSettings = () => {
  const [basemapContextualSelected, setBasemapContextual] = useRecoilState(basemapContextualAtom);

  return (
    <div className="relative flex flex-col font-light text-black/85">
      {CONTEXTUAL_LAYERS_PLANET_SERIES_ATTRIBUTES.map(({ id, name, mosaic_id }) => {
        const isActive = basemapContextualSelected === id;

        const handleClick = () => {
          const updatedContextualBasemap = basemapContextualSelected === id ? null : id;
          setBasemapContextual(updatedContextualBasemap as ContextualBasemapsId);
        };
        return (
          <div key={id} className="ml-0.5 flex flex-col">
            <div className="flex items-center space-x-4 py-1 font-light text-black/85">
              <button
                type="button"
                onClick={handleClick}
                data-testid={id}
                className={cn({
                  'flex h-3 w-3 shrink-0 items-center justify-center rounded-full border border-black/85':
                    true,
                  'border-4 border-brand-800': isActive,
                })}
              ></button>

              <p className="font-sm m-0 text-sm font-semibold text-brand-800">{name}</p>
            </div>
            {isActive && (
              <div className="ml-6">
                <DateSelect mosaic_id={mosaic_id} id={id} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BasemapsMapSettings;
