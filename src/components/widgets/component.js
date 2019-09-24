import React, { useState } from 'react';
import PropTypes from 'prop-types';
import OnScroll from 'react-on-scroll';
import classnames from 'classnames';

import styles from './style.module.scss';

const WidgetList = ({ widgets, templates, ...parentProps }) => {
  const [securityMargin, setMargin] = useState(false);

  return (
    <OnScroll
      triggers={[{ top: -65, callback: _securityMargin => setMargin(!_securityMargin) }]}
    >
      <div className={classnames(styles.widgets, {
        [styles.securityMargin]: securityMargin
      })}>
        {widgets.map((widget) => {
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
    </OnScroll>)
};

WidgetList.propTypes = {
  widgets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string
    })
  ),
  templates: PropTypes.instanceOf(Map)
};

WidgetList.defaultProps = {
  widgets: [],
  templates: new Map()
};

export default WidgetList;
