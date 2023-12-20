import { WIDGET_CARD_WRAPPER_STYLE } from 'styles/widgets';

import SaltMarshLegend from './legend';

const SaltMarshContent = () => {
  return (
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
      <p>
        The map shows the distribution of tidal marshes in the year 2020. It represents the first
        globally consistent tidal marsh map and is available at 10m resoulution. It was created
        using optical and radar images from the European Space Agency’s Sentinel missions. The
        research was a collaboration between the University of Cambridge, The Nature Conservancy and
        James Cook University.
      </p>
      <SaltMarshLegend />
    </div>
  );
};

export default SaltMarshContent;
