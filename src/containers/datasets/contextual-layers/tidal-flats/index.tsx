import cn from 'classnames';

import { WIDGET_CARD_WRAPPER_STYLE } from 'styles/widgets';

const LayerNameContent = () => (
  <div className={WIDGET_CARD_WRAPPER_STYLE}>
    <p>Layer description Lorem ipsum dolor sit amet consectetur.</p>
    <div className="flex">
      <div className="my-0.5 mr-2.5 h-4 w-2 shrink-0 rounded-md bg-[#C1766F] text-sm" />
      <p className="text-sm font-normal">Tidal flats</p>
    </div>
  </div>
);

export default LayerNameContent;
