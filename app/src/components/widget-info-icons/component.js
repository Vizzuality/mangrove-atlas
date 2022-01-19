import React from 'react';
import PropTypes from 'prop-types';

// components
import Download from './download';
import Info from './info';
import Toggle from './toggle';

import styles from './style.module.scss';


const WidgetControls = ({ name, slug, layerId, layersIds, isActive }) => {
  return (
    <div className={styles.widgetControls}>
      <Download slug={slug} />
      <Info slug={slug} />
      {!!layersIds?.length && (
        <Toggle
          name={name}
          slug={slug}
          layerId={layerId}
          layersIds={layersIds}
          isActive={isActive}
        />
      )}
    </div>
  );
};

WidgetControls.propTypes = {
  name: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  layerId: PropTypes.string.isRequired,
  layersIds: PropTypes.array.isRequired,
  isActive: PropTypes.bool.isRequired
};

export default WidgetControls;
