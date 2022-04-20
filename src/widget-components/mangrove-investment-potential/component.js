import React, { useEffect } from "react";
import PropTypes from "prop-types";
import ChartWidget from "components/chart-widget";
import config from "./config";

const rawData = [
  {
    id: "1",
    date: "2016-06-25",
    blue_carbon_rate: {
      additional_invisible_blue_carbon: 58599882,
      protected_area: 5996751,
      invisible_blue_carbon: 36665682,
      remaining_mangrove: 13668129,
    },
  },
];
function MangroveInvestmentPotential({
  /*  data: rawData, */
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
    addFilter({
      filter: {
        id: "investment-potential",
        year: "2016",
      },
    });
    fetchInvestmentPotentialData({ currentLocation });
  }, [addFilter]);

  if (!rawData) {
    return null;
  }
  const { chartData, totalValues, chartConfig } = config.parse(rawData);

  if (!chartData || chartData.length <= 0) {
    return null;
  }

  const location =
    currentLocation.location_type === "worldwide" ? (
      "the world"
    ) : (
      <span className="notranslate">{`${currentLocation.name}`}</span>
    );

  const sentence = (
    <>
      Blue Carbon Investment Potential
      <strong>
        &nbsp;{location}
        {"'"}s&nbsp;
      </strong>
      extent of investible blue carbon (ha) is <strong>{totalValues} </strong>
      (±21,100) (at $5/ton)
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
