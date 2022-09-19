import { flatten } from "lodash";

const extentLineStyle = {
  "line-color": 'blue', //"#06C4BD",
  "line-width": [
    "interpolate",
    ["linear"],
    ["zoom"],
    0,
    10,
    12,
    0,
],
  "line-blur": [
    "interpolate",
    ["linear"],
    ["zoom"],
    0,
    60,
    12,
    0,
],
};

const extentFillStyle = {
  "fill-color": "#06C4BD",
  "fill-opacity": 1,
};

// based on years available in mapbox for this layer
const years = [1996, 2007, 2008, 2009, 2010, 2015, 2016, 2017, 2018, 2019, 2020];

export const extentLayers = years.map((year) => ({
  layerId: `extent_${year}`,
  year,
  minZoom: 0,
  maxZoom: 12,
}));

export const extentLayersStyles = flatten(years.reduce((acc, year) => {
  const fill = {
  id: `extent_${year}`,
  type: "fill",
  source: "extent",
  "source-layer": `mng_mjr_${year}`,
  paint: extentFillStyle,
};

const line = {
  id: `extent_${year}_line`,
  type: "line",
  source: "extent",
  "source-layer": `mng_mjr_${year}`,
  paint: extentLineStyle,
};

return ([ ...acc, { ...fill }, { ...line }])}, []));