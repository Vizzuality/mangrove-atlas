import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import breakpoints from 'utils/responsive';
import Spinner from 'components/spinner';
import Button from 'components/button';

import styles from './style.module.scss';

const WidgetList = ({ widgets, templates, isSticky, ...parentProps }) => {
  const onClickDownload = () => window.print();

  return (
    <div className={classnames(styles.widgets, {
      [styles.securityMargin]: isSticky && (window.innerWidth > breakpoints.lg + 1),
      [styles.spinner]: !widgets.length
    })}
    >
      {!widgets.length
        ? <div className={styles.spinner}><Spinner /></div>
        : widgets.length && widgets.map((widget) => {
          const Widget = templates.get(widget.slug).component;
          return (

            <Widget
              key={widget.slug}
              {...widget}
              {...parentProps}
            />
          );
        })
      }
      {widgets.length ? (
        <Button
          className={styles.printBtn}
          hasBackground
          onClick={onClickDownload}
        >
          Download report as PDF
        </Button>
      ) : null }
    </div>
  );
};

WidgetList.propTypes = {
  widgets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string
    })
  ),
  templates: PropTypes.instanceOf(Map),
  isSticky: PropTypes.bool
};

WidgetList.defaultProps = {
  widgets: [],
  templates: new Map(),
  isSticky: false
};

export default WidgetList;
