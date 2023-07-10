import cn from 'classnames';

import CardBasemapContextual from 'components/contextual-basemaps/card';
import { WIDGET_CARD_WRAPPER_STYLE } from 'styles/widgets';

const LayerNameContent = () => {
  const layerDescription = null;

  return (
    <div className={cn(`${WIDGET_CARD_WRAPPER_STYLE} flex`)}>
      <CardBasemapContextual id="mangrove_tidal_flats" type="contextual-layer" />
      <p className="m-0">
        {layerDescription || 'Layer description Lorem ipsum dolor sit amet consectetur.'}
      </p>
    </div>
  );
};

export default LayerNameContent;
