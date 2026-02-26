import cn from '@/lib/classnames';

import { WIDGET_CARD_WRAPPER_STYLE } from 'styles/widgets';

import CommercialFisheriesProduction from './commercial-fisheries-production/widget';
import Fisheries from './fisheries/widget';

const FisheriesWrapper = () => {
  return (
    <div className={cn(WIDGET_CARD_WRAPPER_STYLE, 'space-y-4')}>
      <Fisheries />
      <div className="bg-brand-800/30 absolute right-4 left-4 my-4 h-0.5" />
      <CommercialFisheriesProduction />
    </div>
  );
};

export default FisheriesWrapper;
