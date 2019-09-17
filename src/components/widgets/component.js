import React from 'react';
import PropTypes from 'prop-types';
import Widget from 'components/widget';
import styles from './style.module.scss';

function WidgetList({
  widgets,
  ...parentProps
}) {
  return (

    <div className={styles.widgets}>
      {widgets.map(widget => (
        <Widget
          key={widget.slug}
          isCollapsed={widget.isCollpased}
          {...widget}
          {...parentProps}
        />
      ))}
    </div>
  );
}

WidgetList.propTypes = {
  widgets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string
    })
  )
};

WidgetList.defaultProps = {
  widgets: []
};

export default WidgetList;
