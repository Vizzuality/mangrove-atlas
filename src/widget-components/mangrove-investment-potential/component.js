import React, { useEffect } from "react";
import PropTypes from "prop-types";
import ChartWidget from "components/chart-widget";
import config from "./config";

function MangroveInvestmentPotential({
  data,
  currentLocationId,
  current,
  isCollapsed = true,
  slug,
  name,
  addFilter,
  setUi,
  fetchInvestmentPotentialData,
  ...props
}) {
  const { location_id } = currentLocationId;

  useEffect(() => {
    if (location_id === 'worldwide' || location_id === 1561) {
      fetchInvestmentPotentialData()
    }
    else {
      fetchInvestmentPotentialData({ ...(location_id && location_id !== 1561) && { location_id } });
    }
  }, [currentLocationId, current, fetchInvestmentPotentialData]);

  useEffect(() => {
    addFilter({
      filter: {
        id: "investment_potential",
        year: "2016",
      },
    });
  }, [addFilter, currentLocationId]);

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
  setUi: () => {},
};

export default MangroveInvestmentPotential;
