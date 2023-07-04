import CardBasemapContextual from 'components/contextual-basemaps/card';
import { WIDGET_CARD_WRAPPER_STYLE } from 'styles/widgets';

const LayerNameContent = () => {
  return (
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
      <CardBasemapContextual id="mangrove_allen_coral_reef" type="contextual" />
    </div>
  );
};

export default LayerNameContent;
