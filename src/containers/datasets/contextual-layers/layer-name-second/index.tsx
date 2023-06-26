import Legend from 'containers/legend';

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
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
      <p>{layerDescription || 'Layer description Lorem ipsum dolor sit amet consectetur.'}</p>
      <div>{legend && <Legend items={legend.items} variant="horizontal" unit={legend.unit} />}</div>
    </div>
  );
};

export default LayerNameContent;
