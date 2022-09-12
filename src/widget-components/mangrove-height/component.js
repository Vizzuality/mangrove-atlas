import React, { useEffect } from "react";
import PropTypes from "prop-types";

// components
import Select from "components/select";
import ChartWidget from "components/chart-widget";

// utils
import { format } from "d3-format";

import { WORLWIDE_LOCATION_ID } from "modules/widgets/constants";

import config from "./config";

const numberFormat = format(",.2f");

const MangroveHeight = ({
  data,
  isLoading,
  metadata,
  isCollapsed = true,
  slug,
  name,
  currentLocation,
  addFilter,
  ui,
  setUi,
  setData,
  fetchMangroveHeightData,
  ...props
}) => {
  const { id } = currentLocation;
  const { year } = ui;
  const heightCoverage = metadata?.avg_height[0]?.value;
  const years = metadata?.year;

  useEffect(() => {
    if (!id || id === WORLWIDE_LOCATION_ID) {
      fetchMangroveHeightData();
    } else {
      fetchMangroveHeightData({ location_id: id });
    }
  }, [id, fetchMangroveHeightData]);

  useEffect(() => {
    if (!isLoading) {
      addFilter({
        filter: {
          id: "height",
          year: years?.[0],
        },
      });
      setUi({
        id: "height",
        value: {
          year: year || years?.[0],
        },
      });
    }
  }, [setUi, year, years, addFilter, isLoading]);

  // useEffect(() => {
  //   if (!data) setData({ slug, data: false });
  // }, [data, slug]);

  if (!data || !year) {
    return null;
  }

  const { chartData, chartConfig, downloadData } = config.parse(
    data,
    year,
    years,
    heightCoverage
  );

  const location = currentLocation?.name;

  const dateOptions = () =>
    years.map((year) => ({
      label: year.toString(),
      value: year,
    }));

  const dateHandler = (value) => {
    setUi({ id: "height", value: { year: value } });
    addFilter({
      filter: {
        id: "height",
        year: value,
      },
    });
  };

  const dateSelector = (
    <Select
      value={year}
      options={dateOptions}
      onChange={(value) => dateHandler(value)}
    />
  );

  const sentence = (
    <>
      Mean mangrove <strong>maximum</strong> canopy height in{" "}
      <strong>{location}</strong> was
      <strong> {numberFormat(heightCoverage)} m</strong> in{" "}
      <strong>{dateOptions.length > 1 ? dateSelector : year}</strong>.
    </>
  );
  const widgetData = {
    data: chartData,
    config: chartConfig,
  };

  if (!chartData || !chartData.length) {
    return null;
  }
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
};

MangroveHeight.propTypes = {
  data: PropTypes.shape({}),
  isLoading: PropTypes.bool,
  metadata: PropTypes.shape({
    avg_height: PropTypes.arrayOf(
      PropTypes.shape({
        year: PropTypes.number,
        value: PropTypes.number,
      })
    ),
    location_id: PropTypes.string,
    note: PropTypes.string,
    units: PropTypes.shape({}),
    year: PropTypes.arrayOf(PropTypes.number),
  }),
  isCollapsed: PropTypes.bool,
  slug: PropTypes.string,
  name: PropTypes.string,
  currentLocation: PropTypes.shape({}),
  ui: PropTypes.string,
  addFilter: PropTypes.func,
  setUi: PropTypes.func,
  fetchMangroveHeightData: PropTypes.func,
};

MangroveHeight.defaultProps = {
  data: null,
  isLoading: true,
  metadata: null,
  isCollapsed: false,
  slug: null,
  name: null,
  currentLocation: null,
  ui: null,
  addFilter: () => {},
  setUi: () => {},
  fetchMangroveHeightData: () => {},
};

export default MangroveHeight;
