import { WIDGET_CARD_WRAPPER_STYLE } from 'styles/widgets';

import Fisheries from './fisheries/widget';
import CommercialFisheriesProduction from './commercial-fisheries-production/widget';
import cn from 'lib/classnames';

const FisheriesWrapper = () => {
  return (
    <div className={cn(WIDGET_CARD_WRAPPER_STYLE, 'space-y-4')}>
      <Fisheries />
      <div className="absolute left-4 right-4 my-4 h-0.5 bg-brand-800/30" />
      <CommercialFisheriesProduction />
    </div>
  );
};

export default FisheriesWrapper;
