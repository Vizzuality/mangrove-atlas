import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

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
    onMapAction({ id });
  };

  const collapseToggleHandler = () => {
    onCollapseToggle({ id, isCollapsed: !isCollapsed });
  };

  return (
    <div className="c-widget">
      <div className="widget--header">
        <button type="button" onClick={collapseToggleHandler}>Expand/Collapse</button>
        <h3>{title}</h3>
        <button type="button" onClick={mapActionHandler}>Show on Map</button>
      </div>
      <div className={classnames('widget--body', { '-collapsed': isCollapsed })}>
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
