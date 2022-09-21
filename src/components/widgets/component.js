import React, { useCallback, useMemo } from "react";
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
  alerts,
  category,
  dataByWidget,
  ...parentProps
}) => {
  const onClickDownload = useCallback(() => {
    window.print();
  }, []);

  const widgetsCategory = useMemo(() =>
    widgets.filter(
      ({ categoryIds }) =>
        categoryIds.includes(category),
      [category, widgets]
    )
  );

  const widgetsFiltered = useMemo(() =>
    widgets.filter(
      ({ categoryIds, slug }) =>
        categoryIds.includes(category) && dataByWidget.includes(slug),
      [category, widgets, dataByWidget]
    )
  );

  return (
    <div
      key={category}
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
        widgetsCategory?.map((widget, index) => {
          const Widget = templates.get(widget.slug).component;
          const isLast = widgetsFiltered[widgetsFiltered?.length - 1]?.slug === widget.slug;
          return (
            <div
              key={widget.slug}
              className={cx(styles.widgetWrapper, {
                [styles.pageBreak]: index % 2 !== 0,
              })}
            >
              <Widget
                className={cx(styles.widgetWrapper, {
                  [styles.pageBreak]: index % 2 !== 0,
                })}
                {...widget}
                {...parentProps}
                key={widget.slug}
                index={index}
                isLast={isLast}
                isCollapsed={isLast ? false : widget.isCollapsed}
              />
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
