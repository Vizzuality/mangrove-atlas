import BASEMAPS from 'containers/datasets/contextual-layers/basemaps';
import { CONTEXTUAL_LAYERS_PLANET_SERIES_ATTRIBUTES } from 'containers/datasets/contextual-layers/constants';

import { WIDGET_CARD_WRAPPER_STYLE } from 'styles/widgets';

import CardBasemapContextual from './card';

const BasemapsContextualMapSettings = () => {
  return (
    <div className={`${WIDGET_CARD_WRAPPER_STYLE} flex flex-col`}>
      {BASEMAPS.map((basemap) => (
        <CardBasemapContextual key={basemap.id} {...basemap} />
      ))}
      {CONTEXTUAL_LAYERS_PLANET_SERIES_ATTRIBUTES.map((basemap) => (
        <CardBasemapContextual key={basemap.id} {...basemap} />
      ))}
    </div>
  );
};

export default BasemapsContextualMapSettings;
