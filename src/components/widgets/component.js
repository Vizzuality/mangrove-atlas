import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Spinner from 'components/spinner';
import Button from 'components/button';
import widgetInfo from 'components/widget-info-icons/info/constants';

import DangerousHTML from 'react-dangerous-html';

import styles from './style.module.scss';

const WidgetList = ({ widgets, isCollapsed, templates, mobile, ...parentProps }) => {
  const onClickDownload = (e) => {
    window.print();
  };

  return (
      <div className={cx(styles.widgets, {
        [styles.spinner]: !widgets.length
      })}
      >
        {!widgets.length
          ? <div className={styles.spinner}><Spinner /></div>
          : widgets.length && widgets.map((widget, index) => {
            const Widget = templates.get(widget.slug).component;
            const widgetSelected = widgetInfo?.[widget.slug];
            const attributes = !!widgetSelected && Object.keys(widgetSelected);

            return (
              <div className={styles.widgetWrapper}>
                <div className={styles.chartWrapper}>

                <Widget
                  key={widget.slug}
                  isLast={widgets.length - 1 === index}
                  {...widget}
                  {...parentProps}
                />
                </div>

                <div className={styles.printOnly}>
                  {!!attributes && attributes.map(attribute => (
                    <div key={attribute}>
                      <strong>
                        {attribute !== 'Title'
                          ? `${attribute}:`
                          : ''}
                      </strong><DangerousHTML html={widgetSelected[attribute]} />
                    </div>
                ))}
              </div>
            </div>
            );
          })
        }
        {widgets.length && !mobile ? (
          <Button
            className={cx(styles.printBtn, { [styles._collapse]: isCollapsed })}
            hasBackground
            onClick={onClickDownload}
          >
            Download report as PDF
          </Button>
        ) : null}
      </div>
  );
};

WidgetList.propTypes = {
  mobile: PropTypes.bool,
  widgets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string
    })
  ),
  templates: PropTypes.instanceOf(Map),
};

WidgetList.defaultProps = {
  mobile: false,
  widgets: [],
  templates: new Map(),
};

export default WidgetList;
