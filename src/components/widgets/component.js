import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import Spinner from "components/spinner";
import Button from "components/button";

import styles from "./style.module.scss";

const WidgetList = ({
  widgets,
  isCollapsed,
  templates,
  mobile,
  ...parentProps
}) => {
  const onClickDownload = (e) => {
    window.print();
  };

  return (
    <div
      className={cx(styles.widgets, {
        [styles.spinner]: !widgets.length,
      })}
    >
      {!widgets.length ? (
        <div className={styles.spinner}>
          <Spinner />
        </div>
      ) : (
        widgets.length &&
        widgets.map((widget, index) => {
          const Widget = templates.get(widget.slug).component;

          return (
            <div key={widget.slug} className={styles.widgetWrapper}>
              <div className={cx({
                  [styles.pageBreak]: index % 2 !== 0
                })}
              >
                <Widget
                  key={widget.slug}
                  isLast={widgets.length - 1 === index}
                  {...widget}
                  {...parentProps}
                />
              </div>
            </div>
          );
        })
      )}
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
      title: PropTypes.string,
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
