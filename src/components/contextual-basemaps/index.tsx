import BASEMAPS from 'containers/datasets/contextual-layers/basemaps';
import { CONTEXTUAL_LAYERS_PLANET_SERIES_ATTRIBUTES } from 'containers/datasets/contextual-layers/constants';
import Helper from 'containers/guide/helper';

import { WIDGET_CARD_WRAPPER_STYLE } from 'styles/widgets';

import CardBasemapContextual from './card';

const BasemapsContextualMapSettings = () => {
  const HELPER_ID = 'mangrove_contextual_basemaps';
  return (
    <div className={`${WIDGET_CARD_WRAPPER_STYLE} relative flex flex-col`}>
      <Helper
        className={{
          button: HELPER_ID ? '-bottom-3.5 -right-1.5 z-[20]' : 'hidden',
          tooltip: 'w-fit-content',
        }}
        tooltipPosition={{ top: 120, left: -70 }}
        message="Use this element to choose a different basemap. There is a choice between light, dark and satellite backgrounds"
      >
        {BASEMAPS.map((basemap) => (
          <CardBasemapContextual key={basemap.id} {...basemap} />
        ))}
      </Helper>
      {CONTEXTUAL_LAYERS_PLANET_SERIES_ATTRIBUTES.map((basemap) => (
        <CardBasemapContextual key={basemap.id} {...basemap} />
      ))}
    </div>
  );
};

export default BasemapsContextualMapSettings;
