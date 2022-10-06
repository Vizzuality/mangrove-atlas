import React, { useEffect } from "react";
import PropTypes from "prop-types";

import ChartWidget from "components/chart-widget";

import config from "./config";

function MangroveSpecies({
  data,
  currentLocation,
  isCollapsed = true,
  slug,
  name,
  addFilter,
  fetchMangroveSpeciesData,
  ...props
}) {
  useEffect(() => {
    fetchMangroveSpeciesData({
      ...(currentLocation?.iso?.toLowerCase() !== "worldwide" && {
        location_id: currentLocation.id,
      }),
    });
  }, [currentLocation, fetchMangroveSpeciesData]);

  useEffect(() => {
    addFilter({
      filter: {
        id: "species",
      },
    });
  }, [addFilter]);

  const { threatened, total } = data;

  const { chartData, chartConfig } = config.parse(data);

  const locationName =
    currentLocation.location_type === "worldwide" ? (
      "The world"
    ) : (
      <span className="notranslate">{`${currentLocation?.name}`}</span>
    );

  const article = threatened === 1 ? "is" : "are";

  const sentence = (
    <>
      <strong>{locationName} </strong>has <strong>{total}</strong> species of
      mangroves. Of them, <strong>{threatened !== 0 ? threatened : 'none'}</strong> {article} considered
      <strong> threatened</strong> by the IUCN Red List.
    </>
  );

  const widgetData = {
    data: chartData,
    config: chartConfig,
  };

  if (!chartData || !chartData.length || !data) {
    return null;
  }

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

MangroveSpecies.propTypes = {
  data: PropTypes.shape({}),
  currentLocation: PropTypes.shape({}),
  addFilter: PropTypes.func,
  isCollapsed: PropTypes.bool,
  slug: PropTypes.string,
  name: PropTypes.string,
  metadata: PropTypes.shape({}),
};

MangroveSpecies.defaultProps = {
  data: null,
  currentLocation: null,
  addFilter: () => {},
  isCollapsed: false,
  slug: null,
  name: null,
  metadata: null,
};

export default MangroveSpecies;
