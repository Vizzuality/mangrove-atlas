import cn from 'classnames';

import Legend from 'containers/legend';

import CardBasemapContextual from 'components/contextual-basemaps/card';
import { WIDGET_CARD_WRAPPER_STYLE } from 'styles/widgets';

const LayerNameContent = () => {
  const legend = {
    items: [
      {
        label: '0 - 20',
        // value: 10,
        color: '#D6EDFD',
      },
      {
        label: '20 - 40',
        // value: 10,
        color: '#90ACF6',
      },
      {
        label: '40 - 60',
        // value: 10,
        color: '#7768E9',
      },
      {
        label: '60 - 80',
        // value: 10,
        color: '#793DD2',
      },
      {
        label: '80 - 100',
        // value: 10,
        color: '#831C9D',
      },
    ],
    unit: '% mg Ha',
  };

  const layerDescription = null;

  return (
    <div className={cn(`${WIDGET_CARD_WRAPPER_STYLE} flex`)}>
      <CardBasemapContextual id="mangrove_tidal_flats" type="contextual" />
      <p className="m-0">
        {layerDescription || 'Layer description Lorem ipsum dolor sit amet consectetur.'}
      </p>
    </div>
  );
};

export default LayerNameContent;
