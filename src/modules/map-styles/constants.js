import { flatten } from "lodash";
import alerts from "./templates/alerts.json";
import { extentLayersStyles, extentLayers } from "./templates/extent";

function toRasterSource({ filename, year, source, env }) {
  if (env === "staging") return {
    tiles: [`https://mangrove_atlas.storage.googleapis.com/staging/tilesets/${filename}/${year}/{z}/{x}/{y}.png`],
    type: "raster",
    tileSize: 256,
    ...source,
  };
  else return {
    tiles: [`https://mangrove_atlas.storage.googleapis.com/tilesets/${filename}/{z}/{x}/{y}.png`],
    type: "raster",
    tileSize: 256,
    ...source,
  };
}

function createRasterLayer({ name, render }) {
  return [
    {
      id: name,
      type: "raster",
      source: `${name}-tiles`,
      layout: {
        visibility: "none",
      },
      ...render,
    },
  ];
}

const geojsons = [
  {
    id: "alerts",
    source: {
      type: "geojson",
      // Provided in the mapStyle selector
      // data: 'https://us-central1-mangrove-atlas-246414.cloudfunctions.net/fetch-alerts-heatmap?{{start_date}}&{{end_date}}&{{locationId}}'
    },
    layers: alerts,
  },
];
const vectors = [
  {
    id: "restoration",
    source: {
      type: "vector",
      promoteId: "ID",
    },
    layers: [
      {
        id: "restoration",
        type: "fill",
        source: "restoration",
        "source-layer": "MOW_Global_Mangrove_Restoration",
        paint: {
          "fill-color": "#8122A6",
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            0.8,
            0.5,
          ],
          "fill-outline-color": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            "#8122A6",
            "rgba(129, 24, 166, 0.5)",
          ],
        },
      },
    ],
  },
  {
    id: "extent",
    source: {
      type: "vector",
    },
    layers: extentLayersStyles
  },
];

// years available in google cloud
const mangroveAbovegroundBiomassYears = [1996, 2007, 2008, 2009, 2010, 2015, 2016, 2017, 2018, 2019, 2020];
const mangroveCanopyHeightYears = [2007, 2008, 2009, 2010, 2015, 2016, 2017, 2018, 2019, 2020];

const mangroveAbovegroundBiomassRasters = mangroveAbovegroundBiomassYears.map((year) => ({
  name: `biomass_1996_v1-0_z0-12_${year}`,
  filename: "mangrove_aboveground_biomass-v3",
  year,
  source: {
    type: "raster",
    env: "staging",
    minzoom: 0,
    maxzoom: 12,
  },
  render: {
    minzoom: 0,
    maxzoom: 12,
  },
}));

const mangroveAbovegroundBiomassLayers =  mangroveAbovegroundBiomassRasters.map(({ name, year }) => ({
  layerId: name,
  year,
  minZoom: 0,
  maxZoom: 12,
}));  

const mangroveCanopyHeightRasters = mangroveCanopyHeightYears.map((year) => ({
  name: `mangrove_canopy_height-v3_${year}`,
  filename: "mangrove_canopy_height-v3",
  year,
  source: {
    type: "raster",
    env: "staging",
    minzoom: 0,
    maxzoom: 12,
  },
  render: {
    minzoom: 0,
    maxzoom: 12,
  },
}));

const mangroveCanopyHeightLayers = mangroveCanopyHeightRasters.map(({ name, year }) => ({
  layerId: name,
  year,
  minZoom: 0,
  maxZoom: 12,
}));  

const rasters = flatten([
  ...mangroveAbovegroundBiomassRasters,
  ...mangroveCanopyHeightRasters,
  {
    name: "gl_2007_1996_gain_z0-12",
    filename: "gl_2007_1996_gain_z0-12",
    source: {
      type: "raster",
      env: "prod",
      minzoom: 0,
      maxzoom: 12,
    },
  },
  {
    name: "gl_2007_2008_loss_z0-12",
    filename: "gl_2007_2008_loss_z0-12",
    source: {
      type: "raster",
      env: "prod",
      minzoom: 0,
      maxzoom: 12,
    },
  },
  {
    name: "gl_2008_2007_gain_z0-12",
    filename: "gl_2008_2007_gain_z0-12",
    source: {
      type: "raster",
      env: "prod",
      minzoom: 0,
      maxzoom: 12,
    },
  },
  {
    name: "gl_2008_2009_loss_z0-12",
    filename: "gl_2008_2009_loss_z0-12",
    source: {
      type: "raster",
      env: "prod",
      minzoom: 0,
      maxzoom: 12,
    },
  },
  {
    name: "gl_2009_2008_gain_z0-12",
    filename: "gl_2009_2008_gain_z0-12",
    source: {
      type: "raster",
      env: "prod",
      minzoom: 0,
      maxzoom: 12,
    },
  },
  {
    name: "gl_2009_2010_loss_z0-12",
    filename: "gl_2009_2010_loss_z0-12",
    source: {
      type: "raster",
      env: "prod",
      minzoom: 0,
      maxzoom: 12,
    },
  },
  {
    name: "gl_2010_2009_gain_z0-12",
    filename: "gl_2010_2009_gain_z0-12",
    source: {
      type: "raster",
      env: "prod",
      minzoom: 0,
      maxzoom: 12,
    },
  },
  {
    name: "gl_2010_2015_loss_z0-12",
    filename: "gl_2010_2015_loss_z0-12",
    source: {
      type: "raster",
      env: "prod",
      minzoom: 0,
      maxzoom: 12,
    },
  },
  {
    name: "gl_2015_2010_gain_z0-12",
    filename: "gl_2015_2010_gain_z0-12",
    source: {
      type: "raster",
      env: "prod",
      minzoom: 0,
      maxzoom: 12,
    },
  },
  {
    name: "gl_2015_2016_loss_z0-12",
    filename: "gl_2015_2016_loss_z0-12",
    source: {
      type: "raster",
      env: "prod",
      minzoom: 0,
      maxzoom: 12,
    },
  },
  {
    name: "gl_2016_2015_gain_z0-12",
    filename: "gl_2016_2015_gain_z0-12",
    source: {
      type: "raster",
      env: "prod",
      minzoom: 0,
      maxzoom: 12,
    },
  },
]);
const sourcesAndLayers = [...rasters, ...geojsons, ...vectors].reduce(
  (acc, item) => {
    const layers = item.source.type === "raster" ? createRasterLayer(item) : [];
    return {
      sources: {
        ...acc.sources,
        ...(item.source.type === "geojson" && {
          [item.id]: item.source,
        }),
        ...(item.source.type === "raster" && {
          [`${item.name}-tiles`]: toRasterSource(item),
        }),
      },
      layers: [
        ...acc.layers,
        ...layers,
        ...(item.source.type === "geojson" || item.source.type === "vector"
          ? item.layers
          : []),
      ],
    };
  },
  { sources: {}, layers: [] }
);

const layersMap = {
  biomass: mangroveAbovegroundBiomassLayers,
  height: mangroveCanopyHeightLayers,
  carbon: [
    {
      layerId: "toc_co2eha-1_2016_z0z12",
      year: 2016,
      minZoom: 0,
      maxZoom: 12,
    },
  ],
  net: [
    {
      layerId: "gl_1996_2007_loss_z0-12",
      year: 2007,
      minZoom: 0,
      maxZoom: 12,
    },
    {
      layerId: "gl_2007_1996_gain_z0-12",
      year: 2007,
      minZoom: 0,
      maxZoom: 12,
    },
    {
      layerId: "gl_2007_2008_loss_z0-12",
      year: 2008,
      minZoom: 0,
      maxZoom: 12,
    },
    {
      layerId: "gl_2008_2007_gain_z0-12",
      year: 2008,
      minZoom: 0,
      maxZoom: 12,
    },
    {
      layerId: "gl_2008_2009_loss_z0-12",
      year: 2009,
      minZoom: 0,
      maxZoom: 12,
    },
    {
      layerId: "gl_2009_2008_gain_z0-12",
      year: 2009,
      minZoom: 0,
      maxZoom: 12,
    },
    {
      layerId: "gl_2009_2010_loss_z0-12",
      year: 2010,
      minZoom: 0,
      maxZoom: 12,
    },
    {
      layerId: "gl_2010_2009_gain_z0-12",
      year: 2010,
      minZoom: 0,
      maxZoom: 12,
    },
    {
      layerId: "gl_2010_2015_loss_z0-12",
      year: 2015,
      minZoom: 0,
      maxZoom: 12,
    },
    {
      layerId: "gl_2015_2010_gain_z0-12",
      year: 2015,
      minZoom: 0,
      maxZoom: 12,
    },
    {
      layerId: "gl_2015_2016_loss_z0-12",
      year: 2016,
      minZoom: 0,
      maxZoom: 12,
    },
    {
      layerId: "gl_2016_2015_gain_z0-12",
      year: 2016,
      minZoom: 0,
      maxZoom: 12,
    },
  ],
  "alerts-heat": [
    {
      layerId: "alerts-heat",
    },
  ],
  "alerts-point": [
    {
      layerId: "alerts-point",
    },
  ],
  restoration: [
    {
      layerId: "restoration",
      minZoom: 0,
      maxZoom: 12,
    },
  ],
  extent: extentLayers,
};
export const scopeFeature = new Map([
  ["short", "ST_Advice"],
  ["medium", "MT_Advice"],
  ["long", "LT_Advice"],
]);

export default {
  layersMap,

  ...sourcesAndLayers,
};
