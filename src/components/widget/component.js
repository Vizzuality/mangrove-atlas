import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const Widget = ({
  id,
  title,
  isCollapsed,
  chart: Chart,
  onMapAction,
  onCollapseToggle
}) => {
  const mapActionHandler = () => {
    onMapAction(id);
  };

  const collapseToggleHandler = () => {
    onCollapseToggle(id, !isCollapsed);
  };

  return (
    <div className="c-widget">
      <div className="widget--header">
        <button type="button" onClick={collapseToggleHandler}>Expand/Collapse</button>
        <h3>{title}</h3>
        <button type="button" onClick={mapActionHandler}>Show on Map</button>
      </div>
      <div className="widget--body">
        <Chart />
      </div>
    </div>
  );
};

Widget.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  isCollapsed: PropTypes.bool,
  chart: PropTypes.func, // It is actually a function stateless component
  onMapAction: PropTypes.func,
  onCollapseToggle: PropTypes.func
};

Widget.defaultProps = {
  isCollapsed: false,
  chart: (
    <h1>Just a placeholder.</h1>
  ),
  onMapAction: () => {},
  onCollapseToggle: () => {}
};

export default Widget;
