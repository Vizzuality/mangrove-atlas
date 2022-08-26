import React, { useEffect } from "react";
import PropTypes from "prop-types";
import ChartWidget from "components/chart-widget";
import config from "./config";

function MangroveInvestmentPotential({
  data,
  currentLocation,
  isCollapsed = true,
  slug,
  name,
  fetchInvestmentPotentialData,
  ...props
}) {

  useEffect(() => {
    fetchInvestmentPotentialData({
      ...(currentLocation?.iso?.toLowerCase() !== "worldwide" && {
        location_id: currentLocation.id,
      }),
    });
  }, [currentLocation, fetchInvestmentPotentialData]);

  if (!data || Object.entries(data).length === 0) {
    return null;
  }
  const { chartData, widgetSentence, chartConfig } = config.parse(data);

  if (!chartData || chartData.length <= 0) {
    return null;
  }

  const sentence = <>{widgetSentence}</>;

  const widgetData = {
    data: chartData,
    config: chartConfig,
  };

  return (
    <ChartWidget
      name={name}
      data={chartData}
      slug={slug}
      filename={slug}
      isCollapsed={isCollapsed}
      sentence={sentence}
      chartData={widgetData}
      {...props}
    />
  );
}

MangroveInvestmentPotential.propTypes = {
  data: PropTypes.shape({}),
  currentLocation: PropTypes.shape({}),
  isCollapsed: PropTypes.bool,
  slug: PropTypes.string,
  name: PropTypes.string,
  metadata: PropTypes.shape({}),
};

MangroveInvestmentPotential.defaultProps = {
  data: null,
  currentLocation: null,
  isCollapsed: false,
  slug: null,
  name: null,
  metadata: null,
};

export default MangroveInvestmentPotential;
