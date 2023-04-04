import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import Chart from "components/chart";
import Widget from "components/widget";

import styles from "./style.module.scss";

function ChartWidget({
  sentence,
  component,
  chart = true,
  chartData,
  className,
  note,
  error,
  hasFlexibleLegend,
  ...props
}) {
  const { data, config } = !!chart && chartData;
  return (
    <Widget className={styles.widget} data={data} {...props}>
      <div className={styles.widget_template}>
        <div className={styles.sentence} key={Date.now()}>
          {sentence}
        </div>
        <div className={cx({ [styles.flexibleLegend]: hasFlexibleLegend })}>
          {chart && <Chart {...props} data={data} config={config} />}
          {component}
        </div>
        {note && (
          <div className={styles.note}>
            <span>Note:</span>
            <span>{note}</span>
          </div>
        )}
      </div>
    </Widget>
  );
}

Widget.propTypes = {
  sentence: PropTypes.node,
  chartData: PropTypes.shape({}),
  chart: PropTypes.boolean,
  component: PropTypes.node,
  className: PropTypes.string,
};

Widget.defaultProps = {
  sentence: null,
  chartData: {},
  chart: true,
  component: null,
  className: null,
};

export default ChartWidget;
