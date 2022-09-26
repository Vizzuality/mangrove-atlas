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
  {
    id: 'restoration-sites',
    source: {
      type: 'geojson',
      cluster: true,
      // Data formatted and appended in mapStyle selector.
      // Data initially fetched by Pages component (initializeApp).
    },
    layers: [
      {
        id: 'restoration-sites-clusters',
        type: 'circle',
        source: 'restoration-sites',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#00AFA7',
          'circle-stroke-width': 1,
          'circle-stroke-color': '#00857F',
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100,
            30,
            500,
            40,
          ],
        },
      },
      {
        id: 'restoration-sites-cluster-count',
        type: 'symbol',
        source: 'restoration-sites',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 16,
        },
        paint: {
          'text-color': '#fff',
        },
      },
      {
        id: 'restoration-sites',
        type: 'circle',
        source: 'restoration-sites',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#00AFA7',
          'circle-radius': 5,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#00857F',
        },
      },
    ],
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

export const sourcesAndLayers = [...rasters, ...geojsons, ...vectors].reduce(
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

export const layersMap = {
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
  'restoration-sites': [
    { layerId: 'restoration-sites' },
    { layerId: 'restoration-sites-cluster-count' },
    { layerId: 'restoration-sites-clusters' },
  ],

};

export const LAYERS_ORDER = [
  { id: 1, name: "extent_1996" },
  { id: 1, name: "extent_1996_line" },
  { id: 1, name: "extent_2007" },
  { id: 1, name: "extent_2007_line" },
  { id: 1, name: "extent_2008" },
  { id: 1, name: "extent_2008_line" },
  { id: 1, name: "extent_2009" },
  { id: 1, name: "extent_2009_line" },
  { id: 1, name: "extent_2010" },
  { id: 1, name: "extent_2010_line" },
  { id: 1, name: "extent_2015" },
  { id: 1, name: "extent_2015_line" },
  { id: 1, name: "extent_2016" },
  { id: 1, name: "extent_2016_line" },
  { id: 1, name: "extent_2017" },
  { id: 1, name: "extent_2017_line" },
  { id: 1, name: "extent_2018" },
  { id: 1, name: "extent_2018_line" },
  { id: 1, name: "extent_2019" },
  { id: 1, name: "extent_2019_line" },
  { id: 1, name: "extent_2020" },
  { id: 1, name: "extent_2020_line" },
  { id: 6, name: "biomass_1996_v1-0_z0-12_1996" },
  { id: 6, name: "biomass_1996_v1-0_z0-12_2007" },
  { id: 6, name: "biomass_1996_v1-0_z0-12_2008" },
  { id: 6, name: "biomass_1996_v1-0_z0-12_2009" },
  { id: 6, name: "biomass_1996_v1-0_z0-12_2010" },
  { id: 6, name: "biomass_1996_v1-0_z0-12_2015" },
  { id: 6, name: "biomass_1996_v1-0_z0-12_2016" },
  { id: 6, name: "biomass_1996_v1-0_z0-12_2017" },
  { id: 6, name: "biomass_1996_v1-0_z0-12_2018" },
  { id: 6, name: "biomass_1996_v1-0_z0-12_2019" },
  { id: 6, name: "biomass_1996_v1-0_z0-12_2020" },
  { id: 3, name: "mangrove_canopy_height-v3_2007" },
  { id: 3, name: "mangrove_canopy_height-v3_2008" },
  { id: 3, name: "mangrove_canopy_height-v3_2009" },
  { id: 3, name: "mangrove_canopy_height-v3_2010" },
  { id: 3, name: "mangrove_canopy_height-v3_2015" },
  { id: 3, name: "mangrove_canopy_height-v3_2016" },
  { id: 3, name: "mangrove_canopy_height-v3_2017" },
  { id: 3, name: "mangrove_canopy_height-v3_2018" },
  { id: 3, name: "mangrove_canopy_height-v3_2019" },
  { id: 3, name: "mangrove_canopy_height-v3_2020" },
  { id: 4, name: "gain_2007" },
  { id: 4, name: "gain_2008" },
  { id: 4, name: "gain_2009" },
  { id: 4, name: "gain_2010" },
  { id: 4, name: "gain_2015" },
  { id: 4, name: "gain_2016" },
  { id: 4, name: "gain_2017" },
  { id: 4, name: "gain_2018" },
  { id: 4, name: "gain_2019" },
  { id: 4, name: "gain_2020" },
  { id: 4, name: "loss_2007" },
  { id: 4, name: "loss_2008" },
  { id: 4, name: "loss_2009" },
  { id: 4, name: "loss_2010" },
  { id: 4, name: "loss_2015" },
  { id: 4, name: "loss_2016" },
  { id: 4, name: "loss_2017" },
  { id: 4, name: "loss_2018" },
  { id: 4, name: "loss_2019" },
  { id: 4, name: "loss_2020" },
  { id: 5, name: "toc_co2eha-1_2016_z0z12" },
  { id: 2, name: "alerts-heat" },
  { id: 2, name: "alerts-point" },
  { id: 7, name: "restoration" },
];

export default {
  layersMap,
  ...sourcesAndLayers,
};
