import CardBasemapContextual from 'components/contextual-basemaps/card';
import { WIDGET_CARD_WRAPPER_STYLE } from 'styles/widgets';

const LayerNameContent = () => (
  <div className={WIDGET_CARD_WRAPPER_STYLE}>
    <CardBasemapContextual id="mangrove_global_tidal_wetland_change" type="contextual-layer" />
    {/* <p>{layerDescription || 'Layer description Lorem ipsum dolor sit amet consectetur.'}</p> */}
  </div>
);

export default LayerNameContent;
