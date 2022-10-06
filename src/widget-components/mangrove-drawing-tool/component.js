import React, { useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import { useDropzone } from "react-dropzone";

// import { useIntl } from 'react-intl';

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
  setCurrentLocation,
  setDrawingValue,
  setDrawingStatus,
  drawingValue,
  setDrawingMode,
  drawingMode,
  expandAll,
  fetchMangroveHabitatExtentData,
}) => {
  const onDropAccepted = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    analysisService.uploadFile(file).then(({ data }) => {
      console.log(drawingValue, data.features, "drawingValue data features");
      console.log(data.features)
      // setDrawingValue(data.features)
      setCurrentLocation({
        id: "custom-area",
        bounds: data.features[0].geometry,
        iso: "custom-area",
        location_id: "custom-area",
        location_type: "custom-area",
        name: "Custom area",
      });
      setCurrent("editing");
      setDrawingStatus({
        type: "FeatureCollection",
        features: "progress",
      });
      setDrawingMode(false);
      fetchMangroveHabitatExtentData({
        drawingValue: data.features,
        slug: ["mangrove_extent"],
        location_id: "custom-area",
      });
    });
  }, []);

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
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
  }, [drawingMode, drawingValue, expandAll]);

  const handleClick = () => {
    console.log("handle click");
  };
  const handleDrawingMode = useCallback(() => {
    console.log('entra drawing')
    setDrawingValue(null);
    setCurrent("drawPolygon");
  }, [setDrawingValue, setCurrent]);

  return drawingValue ? (
    <Widgets />
  ) : (
    <ChartWidget
      name="Draw or upload an area"
      slug="alert"
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
          <span className={styles.title}>Draw area</span>
        </button>
        or
        {!acceptedFileItems.length ? (
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
        <button onClick={handleClick} className={styles.highlighted}>
          supported file formats
        </button>
        <br />
        By uploading data you agree to the{" "}
        <a href="" className={styles.highlighted}>
          Terms of Service
        </a>
      </p>
    </ChartWidget>
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
