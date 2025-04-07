import { WIDGET_CARD_WRAPPER_STYLE } from 'styles/widgets';

import ClimateWatch from './climate-watch';
import FRELIPCC from './frel-ipcc';

const InternationalStatus = () => (
  <div className={WIDGET_CARD_WRAPPER_STYLE}>
    <FRELIPCC />
    <ClimateWatch />
  </div>
);

export default InternationalStatus;
