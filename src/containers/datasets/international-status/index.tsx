import { WIDGET_CARD_WRAPPER_STYLE } from 'styles/widgets';

import ClimateWatch from './climate-watch';
import FRELIPCC from './frel-ipcc';

const InternationalStatus = () => (
  <div className={WIDGET_CARD_WRAPPER_STYLE}>
    <FRELIPCC />
    <div className="relative">
      <div className="absolute -left-8 -right-8 h-px bg-brand-800 bg-opacity-30" />
    </div>
    <ClimateWatch />
  </div>
);

export default InternationalStatus;
