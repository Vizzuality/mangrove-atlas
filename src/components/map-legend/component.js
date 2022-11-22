import React, { Fragment } from "react";
import PropTypes from "prop-types";
import LegendItem from "./legend-item";

const Legend = ({ layers, drawingValue, drawingStatus, customGeojsonFeatures }) => {
  const customLayer = {
    id: "custom-layer",
    name: "delete custom area",
    isActive: !!drawingValue || !!customGeojsonFeatures,
    isNegative: true,
  };
console.log({activeLayersForLegend: layers})
  return (
    <Fragment>
      {(drawingStatus === "progress" || !!drawingValue || !!customGeojsonFeatures) && (
        <LegendItem key={customLayer.id} {...customLayer} />
      )}
      {layers.map((layer) => (
        <LegendItem key={layer.id} {...layer} />
      ))}
    </Fragment>
  );
};

Legend.propTypes = {
  layers: PropTypes.arrayOf(PropTypes.shape({})),
};

Legend.defaultProps = {
  layers: [],
};

export default Legend;
