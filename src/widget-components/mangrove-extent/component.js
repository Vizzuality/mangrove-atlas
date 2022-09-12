import React, { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { format } from "d3-format";
import orderBy from "lodash/orderBy";

import ChartWidget from "components/chart-widget";
import Select from "components/select";

import config from "./config";

const numberFormat = format(",.2f");

const unitOptions = [
  { value: "km²", label: "km²" },
  { value: "ha", label: "ha" },
];

function MangroveExtent({
  data,
  metadata,
  currentLocation,
  addFilter,
  isCollapsed = true,
  slug,
  ui,
  setUi,
  setData,
  fetchMangroveHabitatExtentData,
  ...props
}) {
  const { year: currentYear, unit } = ui;
  const { total_lenght } = metadata;
  const currentUnit = useMemo(() => unit || unitOptions[0].value, [unit]);
  const years = metadata?.year?.reverse();
  const year = useMemo(
    () => currentYear || years?.[years?.length - 1] || 2020,
    [years, currentYear]
  );

  useEffect(() => {
    fetchMangroveHabitatExtentData({
      ...(currentLocation?.iso.toLowerCase() !== "worldwide" && {
        location_id: currentLocation.id,
      }),
    });
  }, [fetchMangroveHabitatExtentData, currentLocation]);

  useEffect(() => {
    if (year) {
      addFilter({
        filter: {
          id: "extent",
          year,
          unit: currentUnit,
        },
      });
    }
    setUi({ id: "extent", value: { ...ui, year, unit: currentUnit } });

  }, [addFilter, unit, year, currentUnit, metadata]);

  // useEffect(() => {
  //   setData({ slug, data: !!data.length });
  // }, [setData, data]);

  if (!data || !data.length || !year) {
    return null;
  }

  const { mangroveArea,
    mangroveCoastCoveragePercentage, chartConfig, chartData, downloadData } =
    config.parse(data, metadata, currentYear, unit);

  const optionsYears = orderBy(
    (years || []).map((year) => ({
      label: year.toString(),
      value: year,
    })),
    ["value"],
    ["desc"]
  );

  let sentence = null;

  const changeYear = (current) => {
    addFilter({
      filter: {
        id: "extent",
        year: current,
      },
    });
    setUi({ id: "extent", value: { ...ui, year: current } });
  };

  const changeUnit = (selectedUnit) => {
    setUi({ id: "extent", value: { ...ui, unit: selectedUnit } });
  };

  const widgetData = {
    data: chartData,
    config: chartConfig,
  };

  try {

    const area =
      unit === "ha"
        ? numberFormat(mangroveArea * 100)
        : numberFormat(mangroveArea);

    const location =
      currentLocation.location_type === "worldwide" ? (
        "the world"
      ) : (
        <span className="notranslate">{`${currentLocation?.name}`}</span>
      );
    const unitSelector = (
      <Select value={currentUnit} options={unitOptions} onChange={changeUnit} />
    );
    const yearSelector = (
      <Select
        className="notranslate"
        width="auto"
        value={year}
        options={optionsYears}
        onChange={changeYear}
      />
    );

    sentence = (
      <>
        <span>The area of mangrove habitat in </span>
        <strong>{location} </strong>
        <span>was </span>
        <strong className="notranslate">{area} </strong>
        {unitSelector}
        <span> in </span>
        {yearSelector},
        <span>
          {" "}
          this represents a linear coverage of{" "}
          <strong>{numberFormat(mangroveCoastCoveragePercentage)}%</strong>{" "}
        </span>{" "}
        of the
        <strong className="notranslate"> {numberFormat(total_lenght)} km</strong>
        <span>
          {" "}
          of the coastline.
          <br />
        </span>
      </>
    );
  } catch (e) {
    sentence = <span>No data for this widget.</span>;
  }

  if (!chartData) return null;

  return (
  // <div>hola</div>
    <ChartWidget
      data={chartData}
      slug={slug}
      filename={slug}
      isCollapsed={isCollapsed}
      downloadData={downloadData}
      sentence={sentence}
      config={chartConfig}
      chartData={widgetData}
      {...props}
    />
  );
}

MangroveExtent.propTypes = {
  data: PropTypes.shape({}),
  metadata: PropTypes.shape({}),
  currentLocation: PropTypes.shape({}),
  addFilter: PropTypes.func,
  isCollapsed: PropTypes.bool,
  slug: PropTypes.string,
  ui: PropTypes.shape({
    currentYear: PropTypes.number,
    unit: PropTypes.string,
  }),
  setUi: PropTypes.func,
  fetchMangroveHabitatExtentData: PropTypes.func,
};

MangroveExtent.defaultProps = {
  data: null,
  metadata: null,
  currentLocation: null,
  addFilter: () => {},
  isCollapsed: true,
  slug: null,
  ui: null,
  setUi: () => {},
  fetchMangroveHabitatExtentData: () => {},
};

export default MangroveExtent;
