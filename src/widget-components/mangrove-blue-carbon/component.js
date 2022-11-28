import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";

import ChartWidget from "components/chart-widget";
import WidgetDrawingToolControls from "widget-components/mangrove-drawing-tool/widget-drawing-tool-controls";

import config from "./config";

const note =
  "This information is based on an outdated GMW version. Please use for reference only while we are in the process of updating this to the latest GMW version 3.";

function MangroveBlueCarbon({
  isLoading,
  data,
  metadata,
  currentLocation,
  isCollapsed = true,
  slug,
  name,
  addFilter,
  drawingMode,
  drawingValue,
  fetchMangroveBlueCarbonData,
  customGeojsonFeatures,
  ...props
}) {
  const [restart, setRestart] = useState(null);
  const customArea = useMemo(() => !!drawingValue?.length || !isEmpty(customGeojsonFeatures), [drawingValue, customGeojsonFeatures]);

  useEffect(() => {
    fetchMangroveBlueCarbonData(
      currentLocation.id === "custom-area"
        ? {
            drawingValue,
            slug: ["mangrove_blue_carbon"],
            location_id: "custom-area",
          }
        : {
            ...(currentLocation?.iso.toLowerCase() !== "worldwide" && {
              location_id: currentLocation.id,
            }),
          }
    );
  }, [fetchMangroveBlueCarbonData, currentLocation, drawingValue]);

  useEffect(() => {
    addFilter({
      filter: {
        id: "carbon",
        year: "2016",
      },
    });
  }, [addFilter]);

  const loadingAnalysis = useMemo(
    () => (isLoading && drawingMode) || restart,
    [isLoading, drawingMode, restart]
  );

  const location = useMemo(() => {
    if (customArea) return "the area selected"
    if (currentLocation.location_type === "worldwide") return "the world"
    else return currentLocation?.name
  }, [currentLocation, customArea]);

  if (!data || !data.length || !metadata) {
    return null;
  }

  const { chartData, chartConfig, downloadData, agb, toc, soc, isAgbParsed } =
    config.parse(data, metadata);

  if (!chartData || chartData.length <= 0) {
    return null;
  }

  const sentence = (
    <>
      Total organic carbon stored in
      <strong>
        &nbsp;{location}
        {"'"}s&nbsp;
      </strong>
      mangroves is estimated at &nbsp;<strong>{toc}</strong> Mt CO₂e with{" "}
      <strong>{agb}</strong> {isAgbParsed ? "t CO₂e" : "Mt CO₂e"} stored in
      above-ground biomass and &nbsp;
      <strong>{soc}</strong> Mt CO₂e stored in the upper 1m of soil.
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
      isCollapsed={loadingAnalysis ? false : isCollapsed}
      downloadData={downloadData}
      sentence={loadingAnalysis ? null : sentence}
      chartData={widgetData}
      chart={!loadingAnalysis}
      note={note}
      {...props}
      component={drawingMode && (
        <WidgetDrawingToolControls
          slug="mangrove_blue_carbon"
          fetch={fetchMangroveBlueCarbonData}
          drawingValue={drawingValue}
          isLoading={isLoading}
          restart={restart}
          setRestart={setRestart}
        />
      )}
    />
  );
}

MangroveBlueCarbon.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})),
  currentLocation: PropTypes.shape({}),
  addFilter: PropTypes.func,
  isCollapsed: PropTypes.bool,
  slug: PropTypes.string,
  name: PropTypes.string,
  metadata: PropTypes.shape({}),
};

MangroveBlueCarbon.defaultProps = {
  data: null,
  currentLocation: null,
  addFilter: () => {},
  isCollapsed: false,
  slug: null,
  name: null,
  metadata: null,
};

export default MangroveBlueCarbon;
