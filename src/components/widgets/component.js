import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import Spinner from "components/spinner";
import Button from "components/button";

import useDynamicRefs from "use-dynamic-refs";

import styles from "./style.module.scss";

const WidgetList = ({
  widgets,
  isCollapsed,
  templates,
  mobile,
  alerts,
  category,
  ...parentProps
}) => {
  const onClickDownload = (e) => {
    window.print();
  };

  const [last, setLast] = useState({
    [category]: null
  });

  const widgetsCategory = widgets.filter(({ categoryIds }) => categoryIds.includes(category), [category]);
  const widgetsCategoryLength = widgetsCategory.length - 1;
  const [getRef, setRef] =  useDynamicRefs();
  const widgetsSlug = widgets.map(({ slug }) => slug)
  
  const checkLastElementContent = (slugs, num) => {
    const ref = getRef(slugs[num])
    if (ref?.current?.children.length === 0) {
      return checkLastElementContent(slugs, num - 1)
    }
    else {
      setLast({ [category]: slugs[num] })
      
      return slugs[num];
    }
  }
  useEffect(() => {
    if (!!widgetsCategoryLength && !last[category]) {
      setTimeout(() => {
        checkLastElementContent(widgetsSlug, widgetsCategoryLength)
      }, 1000);
    }
    if (category !== Object.keys(last)[0]) {
      setLast({
        [category]: checkLastElementContent(widgetsSlug, widgetsCategoryLength)
      })
    }
  }, [widgetsSlug, category, last]);

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
        widgets.map((widget, index) => {
          const Widget = templates.get(widget.slug).component;
          return (
            <div ref={setRef(widget.slug)} key={widget.slug} className={cx(styles.widgetWrapper, {
              [styles.pageBreak]: index % 2 !== 0
            })}>
              <Widget
                key={widget.slug}
                isLast={last[category] === widget.slug}
                {...widget}
                {...parentProps}
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
