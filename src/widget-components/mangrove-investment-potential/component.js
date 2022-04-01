import React, { useEffect } from "react";
import PropTypes from "prop-types";
import ChartWidget from "components/chart-widget";
import config from "./config";

function MangroveInvestmentPotential({ data: rawData, slug, name, ...props }) {
  useEffect(() => {
    addFilter({
      filter: {
        id: "Potential",
      },
    });
  }, [addFilter]);
  if (!rawData) {
    return null;
  }
  const { chartData, totalValues, chartConfig, downloadData } =
    config.parse(rawData);

  if (!chartData || chartData.length <= 0) {
    return null;
  }

  const { avobeGround, soils, totalBiomass } = totalValues;

  const location =
    currentLocation.location_type === "worldwide" ? (
      "the world"
    ) : (
      <span className="notranslate">{`${currentLocation.name}`}</span>
    );

  const sentence = (
    <>
      Blue Carbon Investment Potential Indonesia’s extent of investible blue
      carbon (ha) is 325,400 (±21,100) (at $5/ton)
    </>
  );

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
      downloadData={downloadData}
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
};

MangroveInvestmentPotential.defaultProps = {
  data: null,
  currentLocation: null,
  isCollapsed: false,
  slug: null,
  name: null,
};

export default MangroveInvestmentPotential;
