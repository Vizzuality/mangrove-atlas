import React, { useEffect, useCallback, useMemo, useState } from "react";
import PropTypes from "prop-types";
import bboxTurf from "@turf/bbox";

import cx from "classnames";

import { useDropzone } from "react-dropzone";

import Info from "components/widget-info-icons/info";

import ChartWidget from "components/chart-widget";
import Widgets from "components/widgets";
import Icon from "components/icon";

import analysisService from "services/analysis-service";

import styles from "./style.module.scss";

const sentence = (
  <>
    Draw in the map the area you want to analyze through on-the-fly
    calculations.
  </>
);
export const MangroveDrawingTool = ({
  current,
  setCurrent,
  setDrawingMode,
  setCurrentLocation,
  setDrawingValue,
  drawingValue,
  drawingMode,
  setDrawingStatus,
  expandAll,
  fetchMangroveHabitatExtentData,
  fetchMangroveNetChangeData,
  fetchMangroveHeightData,
  fetchMangroveBiomassData,
  fetchMangroveBlueCarbonData,
  fetchAlerts,
  alertsUi,
  setCustomGeojsonFeatures,
  customGeojsonFeatures,
  mapView,
  setMobileView,
  mobile,
}) => {

  const onDropAccepted = useCallback(
    async (acceptedFiles) => {
      setCurrent("drawingMode");
      setDrawingMode(false);
      const file = acceptedFiles[0];

      analysisService.uploadFile(file).then(({ data }) => {
        setDrawingMode(false);
        setCustomGeojsonFeatures(data.features[0]);
        setCurrentLocation({
          id: "custom-area",
          bounds: bboxTurf(data),
          iso: "custom-area",
          location_id: "custom-area",
          location_type: "custom-area",
          name: "custom area",
        });
        setDrawingStatus({
          type: "FeatureCollection",
          features: "progress",
        });
        fetchMangroveHabitatExtentData({
          drawingValue: data.features,
          slug: ["mangrove_extent"],
          location_id: "custom-area",
        });
        fetchMangroveNetChangeData({
          drawingValue: data.features,
          slug: ["mangrove_net_change"],
          location_id: "custom-area",
        });
        fetchMangroveBiomassData({
          drawingValue: data.features,
          slug: ["mangrove_biomass"],
          location_id: "custom-area",
        });
        fetchMangroveHeightData({
          drawingValue: data.features,
          slug: ["mangrove_height"],
          location_id: "custom-area",
        });
        fetchMangroveBlueCarbonData({
          drawingValue: data.features,
          slug: ["mangrove_blue_carbon"],
          location_id: "custom-area",
        });
        fetchMangroveNetChangeData({
          drawingValue: data.features,
          slug: ["mangrove_net_change"],
          location_id: "custom-area",
        });
        fetchMangroveBiomassData({
          drawingValue: data.features,
          slug: ["mangrove_biomass"],
          location_id: "custom-area",
        });
        fetchMangroveNetChangeData({
          drawingValue: data.features,
          slug: ["mangrove_net_change"],
          location_id: "custom-area",
        });
        fetchMangroveBiomassData({
          drawingValue: data.features,
          slug: ["mangrove_biomass"],
          location_id: "custom-area",
        });
        fetchMangroveHeightData({
          drawingValue: data.features,
          slug: ["mangrove_height"],
          location_id: "custom-area",
        });
        fetchMangroveBlueCarbonData({
          drawingValue: data.features,
          slug: ["mangrove_blue_carbon"],
          location_id: "custom-area",
        });
        fetchAlerts({
          drawingValue: data.features,
          slug: ["mangrove_alerts"],
          location_id: "custom-area",
          start_date: alertsUi.startDate,
          end_date: alertsUi.endDate
        });
      });
      return null; //TO DO feedback usuario
    },
    [
      setCurrent,
      setCurrentLocation,
      setCustomGeojsonFeatures,
      setDrawingMode,
      setDrawingStatus,
      fetchMangroveHabitatExtentData,
      fetchMangroveNetChangeData,
      fetchMangroveHeightData,
      fetchMangroveBiomassData,
      fetchMangroveBlueCarbonData,
      fetchAlerts,
      alertsUi
    ]
  );

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDropAccepted,
    accept: {
      "multipart/form-data": [".zip", ".gpkg", ".geojson", ".json"],
    },
  });

  const acceptedFileItems = acceptedFiles.map((file) => (
    <span key={file.path}>
      {file.path} - {file.size / 1000} MB
    </span>
  ));

  useEffect(() => {
    if (drawingMode && drawingValue) {
      expandAll();
    }
    if(drawingValue && mobile) setMobileView(false);
  }, [drawingMode, drawingValue, expandAll, current, setCurrent, mobile, setMobileView]);


  const [openPanel, setOpenPanel] = useState(true);

  const handleDrawingMode = useCallback(() => {
    mobile && setMobileView(!mapView);
    setDrawingValue(null);
    setCustomGeojsonFeatures(null);
    setCurrent("drawPolygon");
    mobile && setOpenPanel(false);
  }, [setDrawingValue, setCurrent, setCustomGeojsonFeatures, mobile, setMobileView, mapView]);

  const noFile = useMemo(
    () => !acceptedFileItems.length || !customGeojsonFeatures?.length,
    [acceptedFileItems, customGeojsonFeatures]
  );

  return drawingValue || customGeojsonFeatures  ? (
    <Widgets />
  ) : (
    openPanel && (
    <ChartWidget
      name="Draw or upload an area"
      slug="drawingToolAlert"
      filename={null}
      sentence={sentence}
      chart={false}
      isCollapsed={false}
    >
      <div className={styles.containers}>
        <button
          type="button"
          className={cx(styles.drawingCard, {
            [styles._active]: current === "drawPolygon",
          })}
          onClick={handleDrawingMode}
        >
          <Icon name="polyline" size="md" /> {/* primary color */}
          <span className={styles.title}>
            {current === "drawPolygon"
              ? "Start drawing on the map"
              : "Draw area"}
          </span>
        </button>
        or
        {noFile ? (
          <div
            {...getRootProps()}
            className={cx(styles.drawingCard, styles._dashed)}
          >
            <Icon name="upload" size="md" />
            <input {...getInputProps()} />
            <label id="label-file-upload" htmlFor="input-file-upload">
              <div className={styles.text}>
                <span className={styles.title}>Browse shapefile</span>
                <span className={styles.description}>
                  (Click or drag-and-drop file)
                </span>
              </div>
            </label>
          </div>
        ) : (
          <div
            className={cx(
              styles.drawingCard,
              styles._dashed,
              styles.fileWrapper
            )}
          >
            {acceptedFileItems}
            <span className={styles.bold}>Upload shapefile</span>
          </div>
        )}
      </div>
      <p>
        Learn more about
        <Info slug="drawingToolAlert" icon={false}>
          <span className={styles.highlighted}>supported file formats</span>
        </Info>
        <br />
        By uploading data you agree to the{" "}
        <a href="" className={styles.highlighted}>
          Terms of Service
        </a>
      </p>
    </ChartWidget>
    )
  );
};

MangroveDrawingTool.propTypes = {
  current: PropTypes.string,
  setCurrent: PropTypes.func,
  setDrawingValue: PropTypes.func,
};

MangroveDrawingTool.defaultProps = {
  current: null,
  setCurrent: () => null,
  setDrawingValue: () => null,
};

export default MangroveDrawingTool;
