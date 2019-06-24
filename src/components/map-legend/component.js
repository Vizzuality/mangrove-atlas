import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import LegendItem from './legend-item';

const Legend = ({ layers }) => (
  <Fragment>
    {layers.map(layer => <LegendItem key={layer.id} {...layer} />)}
  </Fragment>
);

Legend.propTypes = {
  layers: PropTypes.arrayOf(PropTypes.shape({}))
};

Legend.defaultProps = {
  layers: []
};

export default Legend;
