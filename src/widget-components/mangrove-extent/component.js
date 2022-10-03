import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { format } from "d3-format";

import ChartWidget from "components/chart-widget";
import Select from "components/select";
import WidgetDrawingToolControls from "widget-components/mangrove-drawing-tool/widget-drawing-tool-controls";

import config from "./config";

const numberFormat = format(",.2f");

const unitOptions = [
  { value: "km²", label: "km²" },
  { value: "ha", label: "ha" },
];

function MangroveExtent({
  isLoading,
  data,
  metadata,
  currentLocation,
  addFilter,
  isCollapsed = true,
  slug,
  ui,
  setUi,
  drawingValue,
  drawingMode,
  fetchMangroveHabitatExtentData,
  ...props
}) {
  const [restart, setRestart] = useState(null);
  const { year: currentYear, unit } = ui;
  const { total_lenght } = metadata;
  const currentUnit = useMemo(() => unit || unitOptions[0].value, [unit]);
  const years = metadata?.year?.sort((a, b) => a - b);

  const year = useMemo(
    () => currentYear || years?.[years?.length - 1],
    [years, currentYear]
  );

  useEffect(() => {
    if (!drawingValue) {
      fetchMangroveHabitatExtentData({
        ...(currentLocation?.iso.toLowerCase() !== "worldwide" && {
          location_id: currentLocation.id,
        }),
      });
    } else {
      fetchMangroveHabitatExtentData({
        drawingValue,
        slug: ["mangrove_extent"],
        location_id: "custom-area",
      });
    }
  }, [fetchMangroveHabitatExtentData, currentLocation, drawingValue]);

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
    if (!isLoading) {
      setUi({ id: "extent", value: { year, unit: currentUnit } });
    }
  }, [addFilter, year, currentUnit, 
    //ui, 
    metadata, isLoading, setUi]);

  const changeYear = useCallback(
    (current) => {
      addFilter({
        filter: {
          id: "extent",
          year: current,
        },
      });
      setUi({ id: "extent", value: { ...ui, year: current } });
    },
    [ui, addFilter, setUi]
  );

  const changeUnit = useCallback(
    (selectedUnit) => {
      setUi({ id: "extent", value: { ...ui, unit: selectedUnit } });
    },
    [ui, setUi]
  );

  const location = useMemo(() => {
    if (drawingValue) return "the area selected";
    if (currentLocation.location_type === "worldwide") return "the world";
    else
      return <span className="notranslate">{`${currentLocation?.name}`}</span>;
  }, [currentLocation, drawingValue]);

  const loadingAnalysis = useMemo(
    () => (isLoading && drawingMode) || restart,
    [isLoading, drawingMode, restart]
  );

  if (!data || !data.length || !year) {
    return null;
  }

  const {
    mangroveArea,
    mangroveCoastCoveragePercentage,
    chartConfig,
    chartData,
    downloadData,
  } = config.parse(data, metadata, currentYear, unit);

  const optionsYears = (years || []).map((year) => ({
    label: year.toString(),
    value: year,
  }));

  let sentence = null;

  const widgetData = {
    data: chartData,
    config: chartConfig,
  };

  try {
    const area =
      unit === "ha"
        ? numberFormat(mangroveArea * 100)
        : numberFormat(mangroveArea);

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
        <strong className="notranslate">
          {" "}
          {numberFormat(total_lenght)} km
        </strong>
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
    <ChartWidget
      data={chartData}
      slug={slug}
      filename={slug}
      isCollapsed={loadingAnalysis ? false : isCollapsed}
      downloadData={downloadData}
      sentence={loadingAnalysis ? null : sentence}
      config={chartConfig}
      isLoading={isLoading}
      chartData={widgetData}
      chart={!loadingAnalysis}
      {...props}
    >
      {drawingMode && (
        <WidgetDrawingToolControls
          slug="mangrove_extent"
          fetch={fetchMangroveHabitatExtentData}
          drawingValue={drawingValue}
          isLoading={isLoading}
          restart={restart}
          setRestart={setRestart}
        />
      )}
    </ChartWidget>
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
