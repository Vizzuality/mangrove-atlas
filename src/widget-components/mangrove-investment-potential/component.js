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
  addFilter,
  ui: yearSelected,
  setUi,
  fetchInvestmentPotentialData,
  ...props
}) {

  useEffect(() => {
    const id = currentLocation?.id;
      if (id === 'worldwide') {
        fetchInvestmentPotentialData();
      }
      else {
        fetchInvestmentPotentialData({ location_id: id });
    }
  }, [currentLocation, fetchInvestmentPotentialData]);

  useEffect(() => {
    addFilter({
      filter: {
        id: "investment-potential",
        year: "2016",
      },
    });
  }, [addFilter, currentLocation]);

  if (!data || Object.entries(data).length === 0) {
    return null;
  }
  const { chartData, widgetSentence, chartConfig } = config.parse(data);

  if (!chartData || chartData.length <= 0) {
    return null;
  }

  const sentence = (
    <>
      {widgetSentence}
    </>
  );

  const widgetData = {
    data: chartData,
    config: chartConfig,
  };

  return (
    <ChartWidget
      name={name}
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
  addFilter: PropTypes.func,
  isCollapsed: PropTypes.bool,
  slug: PropTypes.string,
  name: PropTypes.string,
  metadata: PropTypes.shape({}),
  ui: PropTypes.string,
  setUi: PropTypes.func,
};

MangroveInvestmentPotential.defaultProps = {
  data: null,
  currentLocation: null,
  addFilter: () => {},
  isCollapsed: false,
  slug: null,
  name: null,
  metadata: null,
  ui: null,
  setUi: () => {},
};

export default MangroveInvestmentPotential;
