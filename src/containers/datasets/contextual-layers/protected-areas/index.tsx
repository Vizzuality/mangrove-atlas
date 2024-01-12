import { WIDGET_CARD_WRAPPER_STYLE } from 'styles/widgets';

import ProtectedAreasLegend from './legend';

const ProtectedAreas = () => {
  return (
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
      <p>
        Displays areas that are legally protected according to various designations (e.g., national
        parks, state reserves, and wildlife reserves) and managed to achieve conservation
        objectives. The World Database on Protected Areas (WDPA) is the most comprehensive global
        database of marine and terrestrial protected areas. For more info, visit{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.protectedplanet.net/en/thematic-areas/wdpa?tab=WDPA"
          className="font-semibold text-brand-800 underline"
        >
          Protected Planet
        </a>
        .
      </p>
      <ProtectedAreasLegend />
    </div>
  );
};

export default ProtectedAreas;
