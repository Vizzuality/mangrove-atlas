import { WIDGET_CARD_WRAPPER_STYLE } from 'styles/widgets';

import ProtectedAreasLegend from './legend';

const ProtectedAreas = () => {
  return (
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
      <p>pending layer description</p>
      <ProtectedAreasLegend />
    </div>
  );
};

export default ProtectedAreas;
