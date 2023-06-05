import { useMemo } from 'react';

import cn from 'lib/classnames';

import { basemapContextualAtom } from 'store/map-settings';

import { useRecoilState } from 'recoil';

import { INFO } from 'containers/datasets';

import { Checkbox, CheckboxIndicator } from 'components/checkbox';
import Icon from 'components/icon';
import Info from 'components/widget-controls/info';
import { WIDGET_CARD_WRAPPER_STYLE } from 'styles/widgets';

import CHECK_SVG from 'svgs/ui/check.svg?sprite';

const CardBasemapContextual = ({ id, name, description }) => {
  const [basemapContextualSelected, setBasemapContextual] = useRecoilState(basemapContextualAtom);
  const isActive = useMemo(
    () => basemapContextualSelected.includes(id),
    [basemapContextualSelected, id]
  );
  const info = INFO[id];

  const handleClick = () => {
    const contextualsUpdate = isActive
      ? basemapContextualSelected.filter((w) => w !== id)
      : [...basemapContextualSelected, id];
    setBasemapContextual(contextualsUpdate);
  };
  return (
    <div className="w-full border-b-2 border-dashed border-b-brand-800 border-opacity-50 last-of-type:border-none">
      <div className="flex w-full items-center justify-between">
        <h2 className="flex-1 cursor-pointer py-5 text-xs font-bold uppercase -tracking-tighter text-black/85">
          {name}
        </h2>

        {!!info && <Info id={id} content={info} />}
      </div>

      <div className={`${WIDGET_CARD_WRAPPER_STYLE} flex`}>
        <button
          type="button"
          onClick={handleClick}
          className={cn({
            "border-content relative mr-4 h-24 w-24 rounded-lg border-4 border-opacity-100 bg-[url('/images/thumbs/planet.png')] bg-cover bg-center shadow-sm":
              true,
            ' border-brand-800': isActive,
          })}
        >
          <Checkbox
            className={cn({
              'absolute bottom-2 right-2 h-6 w-6 rounded-full focus:ring-0': true,
              'bg-brand-800': isActive,
            })}
            checked={isActive}
          >
            <CheckboxIndicator className="text-white">
              <Icon icon={CHECK_SVG} className="h-full w-full text-white" />
            </CheckboxIndicator>
          </Checkbox>
        </button>

        <div>
          <h4>{name}</h4>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default CardBasemapContextual;
