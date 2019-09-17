import React from 'react';
import PropTypes from 'prop-types';

import styles from './style.module.scss';

const WidgetList = ({ widgets, templates, ...parentProps }) => (
  <div className={styles.widgets}>
    {widgets.map(widget => {
      const Widget = templates.get(widget.slug).component;

      return (
        <Widget
          key={widget.slug}
          {...widget}
          {...parentProps}
        />
      );
    })}
  </div>
);

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
