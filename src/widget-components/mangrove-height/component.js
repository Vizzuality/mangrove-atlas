import React, { useCallback, useEffect, useMemo } from "react";
import PropTypes from "prop-types";

// components
import Select from "components/select";
import ChartWidget from "components/chart-widget";

// utils
import { format } from "d3-format";

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
  fetchMangroveHeightData,
  ...props
}) => {
  const { year } = ui;
  const heightCoverage = metadata?.avg_height[0]?.value;
  const years = metadata?.year;
  const currentYear = useMemo(() => year || years?.[0], [year, years]);

  useEffect(() => {
      fetchMangroveHeightData({
      ...(currentLocation?.iso?.toLowerCase() !== "worldwide" && {
        location_id: currentLocation.id,
      }),
    });
  }, [currentLocation, fetchMangroveHeightData]);

  useEffect(() => {
      addFilter({
        filter: {
          id: "height",
          year: currentYear,
        },
      });
      setUi({
        id: "height",
        value: {
          year: currentYear,
        },
      });
  }, [setUi, currentYear, addFilter]);

  const dateHandler = useCallback((value) => {
    setUi({ id: "height", value: { year: value } });
    addFilter({
      filter: {
        id: "height",
        year: value,
      },
    });
  }, [addFilter, setUi]);

  const location = currentLocation?.name;

  const dateOptions = useMemo(() =>
    years?.map((year) => ({
      label: year.toString(),
      value: year,
    })), [years]);

  if (!data || !year) {
    return null;
  }

  const { chartData, chartConfig, downloadData } = config.parse(
    data,
    year,
    years,
    heightCoverage
  );


  const dateDisplay = dateOptions?.length > 1 ? (
    <Select
      value={year}
      options={dateOptions}
      onChange={(value) => dateHandler(value)}
    />
  ) : year;

  const sentence = (
    <>
      Mean mangrove <strong>maximum</strong> canopy height in{" "}
      <strong>{location}</strong> was
      <strong> {numberFormat(heightCoverage)} m</strong> in{" "}
      <strong>{dateDisplay}</strong>.
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
