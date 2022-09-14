import { flatten } from "lodash";
import alerts from "./templates/alerts.json";
import { extentLayersStyles, extentLayers } from "./templates/extent";
import restoration from "./templates/restoration.json";

function toRasterSource({ filename, year, source, env }) {
  if (env === "staging")
    return {
      tiles: [
        `https://mangrove_atlas.storage.googleapis.com/staging/tilesets/${filename}/${year}/{z}/{x}/{y}.png`,
      ],
      type: "raster",
      tileSize: 256,
      ...source,
    };
  else
    return {
      tiles: [
        `https://mangrove_atlas.storage.googleapis.com/tilesets/${filename}/{z}/{x}/{y}.png`,
      ],
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
    layers: restoration,
  },
  {
    id: "extent",
    source: {
      type: "vector",
    },
    layers: extentLayersStyles,
  },
];

// years available in google cloud
const mangroveAbovegroundBiomassYears = [
  1996, 2007, 2008, 2009, 2010, 2015, 2016, 2017, 2018, 2019, 2020,
];
const mangroveCanopyHeightYears = [
  2007, 2008, 2009, 2010, 2015, 2016, 2017, 2018, 2019, 2020,
];

const mangroveGainLossYears = [
  2007, 2008, 2009, 2010, 2015, 2016, 2017, 2018, 2019, 2020,
];

const mangroveAbovegroundBiomassRasters = mangroveAbovegroundBiomassYears.map(
  (year) => ({
    name: `biomass_1996_v1-0_z0-12_${year}`,
    filename: "mangrove_aboveground_biomass-v3",
    year,
    source: {
      type: "raster",
      minzoom: 0,
      maxzoom: 12,
    },
    env: "staging",
  })
);

const mangroveAbovegroundBiomassLayers = mangroveAbovegroundBiomassRasters.map(
  ({ name, year }) => ({
    layerId: name,
    year,
    minZoom: 0,
    maxZoom: 12,
  })
);

const mangroveCanopyHeightRasters = mangroveCanopyHeightYears.map((year) => ({
  name: `mangrove_canopy_height-v3_${year}`,
  filename: "mangrove_canopy_height-v3",
  year,
  source: {
    type: "raster",
    minzoom: 0,
    maxzoom: 12,
  },
  env: "staging",
}));

const mangroveCanopyHeightLayers = mangroveCanopyHeightRasters.map(
  ({ name, year }) => ({
    layerId: name,
    year,
    minZoom: 0,
    maxZoom: 12,
  })
);

const mangroveGainRasters = mangroveGainLossYears.map(
  (year) => ({
    name: `gain_${year}`,
    filename: "gain",
    year,
    source: {
      type: "raster",
      minzoom: 0,
      maxzoom: 12,
    },
    env: "staging",
  })
);

const mangroveGainLayers = mangroveGainRasters.map(
  ({ name, year }) => ({
    layerId: name,
    year,
    minZoom: 0,
    maxZoom: 12,
  })
);
const mangroveLossRasters = mangroveGainLossYears.map(
  (year) => ({
    name: `loss_${year}`,
    filename: "loss",
    year,
    source: {
      type: "raster",
      minzoom: 0,
      maxzoom: 12,
    },
    env: "staging",
  })
);

const mangroveLossLayers = mangroveLossRasters.map(
  ({ name, year }) => ({
    layerId: name,
    year,
    minZoom: 0,
    maxZoom: 12,
  })
);

const mangroveCarbonRasters = {
  name: 'toc_co2eha-1_2016_z0z12',
  filename: 'toc_co2eha-1_2016_z0z12',
  source: {
    type: "raster",
    minzoom: 0,
    maxzoom: 12,
  },
};

const rasters = flatten([
  ...mangroveAbovegroundBiomassRasters,
  ...mangroveCanopyHeightRasters,
  ...mangroveGainRasters,
  ...mangroveLossRasters,
  mangroveCarbonRasters
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
  net: [ ...mangroveGainLayers, ...mangroveLossLayers],
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

export default {
  layersMap,

  ...sourcesAndLayers,
};
