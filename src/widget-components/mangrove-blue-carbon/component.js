import React, { useEffect } from "react";
import PropTypes from "prop-types";
import ChartWidget from "components/chart-widget";
import config from "./config";

const note =
  "This information is based on an outdated GMW version. Please use for reference only while we are in the process of updating this to the latest GMW version 3.";

function MangroveBlueCarbon({
  data,
  metadata,
  currentLocation,
  isCollapsed = true,
  slug,
  name,
  addFilter,
  ui: yearSelected,
  fetchMangroveBlueCarbonData,
  setUi,
  ...props
}) {

  useEffect(() => {
    fetchMangroveBlueCarbonData({
      ...(currentLocation?.iso.toLowerCase() !== "worldwide" && {
        location_id: currentLocation.id,
      }),
    });
  }, [fetchMangroveBlueCarbonData, currentLocation]);

  useEffect(() => {
    addFilter({
      filter: {
        id: "carbon",
        year: "2016",
      },
    });
  }, [addFilter]);
  
  if (!data || !data.length || !metadata) {
    return null;
  }

  const { chartData, chartConfig, downloadData, agb, toc, soc } = config.parse(data, metadata);

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
      Total organic carbon stored in
      <strong>
        &nbsp;{location}
        {"'"}s&nbsp;
      </strong>
      mangroves is estimated at &nbsp;<strong>{toc}</strong> Mt CO₂e
      with <strong>{agb}</strong> Mt CO₂e stored in above-ground biomass
      and &nbsp;<strong>{soc}</strong> Mt CO₂e stored in the upper 1m of soil.
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
      note={note}
      {...props}
    />
  );
}

MangroveBlueCarbon.propTypes = {
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

MangroveBlueCarbon.defaultProps = {
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

export default MangroveBlueCarbon;
