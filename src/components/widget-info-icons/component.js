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
      <Download />
      <Info />
      <Toggle
        name={name}
        slug={slug}
        layerId={layerId}
        layersIds={layersIds}
        isActive={isActive}
      />
    </div>
  );
};

WidgetControls.propTypes = {


};

WidgetControls.defaultProps = {

};

export default WidgetControls;
