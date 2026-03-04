import cn from '@/lib/classnames';

import { WIDGET_CARD_WRAPPER_STYLE } from 'styles/widgets';

import CommercialFisheriesProduction from './commercial-fisheries-production/widget';
import Fisheries from './fisheries/widget';

const FisheriesWrapper = () => {
  return (
    <div className={cn(WIDGET_CARD_WRAPPER_STYLE, 'space-y-4')}>
      <Fisheries />
      <hr className="bg-brand-800/30 -mx-8 my-8 h-0.5 border-0" /> <CommercialFisheriesProduction />
    </div>
  );
};

export default FisheriesWrapper;
