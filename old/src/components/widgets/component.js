import React, { useCallback, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import Spinner from "components/spinner";
import Button from "components/button";

import styles from "./style.module.scss";

import noDataIcon from "./no-data.svg";

const WidgetList = ({
  widgets,
  isCollapsed,
  templates,
  mobile,
  category,
  categoryWidgets,
  dataByWidget,
  drawingMode,
  setPrintingMode,
  bounds,
  setBounds,
  printMode,
  ...parentProps
}) => {
  const onClickDownload = useCallback(() => {
    setPrintingMode(true);
  }, [setPrintingMode]);

  const widgetsFiltered = useMemo(
    () => widgets.filter(({ slug }) => dataByWidget.includes(slug)),
    [widgets, dataByWidget]
  );

  useEffect(() => {
    if (printMode) {
      setPrintingMode(false);
      window.print();
    }
  }, [printMode, setPrintingMode]);  return (
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
        widgets?.map((widget, index) => {
          const Widget = templates.get(widget.slug).component;
          const isLast =
            widgetsFiltered[widgetsFiltered?.length - 1]?.slug === widget.slug;

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
      {!!widgets.length &&
        !widgetsFiltered.length &&
        !!categoryWidgets &&
        !!dataByWidget.length && (
          <div className={styles.widgetWrapper}>
            <div className={styles.noDataWidget}>
              <img
                className={styles.noDataIcon}
                src={noDataIcon}
                alt="no-data"
              />
              <p>
                Sorry, there are <b>no data</b> for this location.
                <br />
                Try with another category.
              </p>
            </div>
          </div>
        )}
      {widgets.length && widgetsFiltered.length && !mobile ? (
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
