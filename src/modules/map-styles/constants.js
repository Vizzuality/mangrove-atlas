function toRasterSource({ filename, minzoom, maxzoom }) {
  return {
    tiles: [`https://mangrove_atlas.storage.googleapis.com/tilesets/${filename}/{z}/{x}/{y}.png`],
    type: 'raster',
    tileSize: 256,
    minzoom,
    maxzoom
  };
}

function createLayer({ name, minzoom, maxzoom }) {
  return {
    id: name,
    type: 'raster',
    source: `${name}-tiles`,
    minzoom,
    maxzoom,
    layout: {
      visibility: 'none'
    }
  };
}

const rasters = [
  {
    name: 'biomass_1996_v1-0_z0-12',
    filename: 'mangrove_aboveground_biomass_1996_v1-0_z0-12',
    minzoom: 0,
    maxzoom: 12
  },
  {
    name: 'biomass_1996_v1-0_z13-15',
    filename: 'mangrove_aboveground_biomass_1996_v1-0_z13-15',
    minzoom: 13,
    maxzoom: 15
  },
  {
    name: 'biomass_2000_v1-2_z0-12',
    filename: 'mangrove_aboveground_biomass_2000_v1-2_z0-12',
    minzoom: 0,
    maxzoom: 12
  },
  // Overlapping, not considered on map
  {
    name: 'biomass_2000_v1-2_z0-13',
    filename: 'mangrove_aboveground_biomass_2000_v1-2_z0-13',
    minzoom: 0,
    maxzoom: 13
  },
  {
    name: 'biomass_2000_v1-2_z13-15',
    filename: 'mangrove_aboveground_biomass_2000_v1-2_z13-15',
    minzoom: 13,
    maxzoom: 15
  },
  {
    name: 'biomass_2007_v1-0_z0-12',
    filename: 'mangrove_aboveground_biomass_2007_v1-0_z0-12',
    minzoom: 0,
    maxzoom: 12
  },
  {
    name: 'biomass_2007_v1-0_z13-15',
    filename: 'mangrove_aboveground_biomass_2007_v1-0_z13-15',
    minzoom: 13,
    maxzoom: 15
  },
  {
    name: 'biomass_2008_v1-0_z0-12',
    filename: 'mangrove_aboveground_biomass_2008_v1-0_z0-12',
    minzoom: 0,
    maxzoom: 12
  },
  {
    name: 'biomass_2008_v1-0_z13-15',
    filename: 'mangrove_aboveground_biomass_2008_v1-0_z13-15',
    minzoom: 13,
    maxzoom: 15
  },
  {
    name: 'biomass_2009_v1-0_z0-12',
    filename: 'mangrove_aboveground_biomass_2009_v1-0_z0-12',
    minzoom: 0,
    maxzoom: 12
  },
  {
    name: 'biomass_2009_v1-0_z13-15',
    filename: 'mangrove_aboveground_biomass_2009_v1-0_z13-15',
    minzoom: 13,
    maxzoom: 15
  },
  {
    name: 'biomass_2010_v1-0_z0-12',
    filename: 'mangrove_aboveground_biomass_2010_v1-0_z0-12',
    minzoom: 0,
    maxzoom: 12
  },
  {
    name: 'biomass_2010_v1-0_z13-15',
    filename: 'mangrove_aboveground_biomass_2010_v1-0_z13-15',
    minzoom: 13,
    maxzoom: 15
  },
  {
    name: 'biomass_2015_v1-0_z0-12',
    filename: 'mangrove_aboveground_biomass_2015_v1-0_z0-12',
    minzoom: 0,
    maxzoom: 12
  },
  {
    name: 'biomass_2016_v1-0_z0-12',
    filename: 'mangrove_aboveground_biomass_2016_v1-0_z0-12',
    minzoom: 0,
    maxzoom: 12
  },
  // The only year with basal height, ignored for now
  {
    name: 'basal_height_2000_v1-2_z0-13',
    filename: 'mangrove_basal-area_weighted_height_2000_v1-2_z0-13',
    minzoom: 0,
    maxzoom: 13
  },
  {
    name: 'height_1996_v1-0_z0-12',
    filename: 'mangrove_max_canopy_height_1996_v1-0_z0-12',
    minzoom: 0,
    maxzoom: 12
  },
  // Cover less years than next one, ignored for now
  {
    name: 'height_2000_v1-2_z0-12',
    filename: 'mangrove_max_canopy_height_2000_v1-2_z0-12',
    minzoom: 0,
    maxzoom: 12
  },
  {
    name: 'height_2000_v1-2_z0-13',
    filename: 'mangrove_max_canopy_height_2000_v1-2_z0-13',
    minzoom: 0,
    maxzoom: 13
  },
  {
    name: 'height_2007_v1-0_z0-12',
    filename: 'mangrove_max_canopy_height_2007_v1-0_z0-12',
    minzoom: 0,
    maxzoom: 12
  },
  {
    name: 'height_2008_v1-0_z0-12',
    filename: 'mangrove_max_canopy_height_2008_v1-0_z0-12',
    minzoom: 0,
    maxzoom: 12
  },
  {
    name: 'height_2009_v1-0_z0-12',
    filename: 'mangrove_max_canopy_height_2009_v1-0_z0-12',
    minzoom: 0,
    maxzoom: 12
  },
  // Cover less years than next one, ignored for now
  {
    name: 'height_2010_v1-0_z0-12',
    filename: 'mangrove_max_canopy_height_2010_v1-0_z0-12',
    minzoom: 0,
    maxzoom: 12
  },
  {
    name: 'height_2010_v1-0_z0-15',
    filename: 'mangrove_max_canopy_height_2010_v1-0_z0-15',
    minzoom: 0,
    maxzoom: 15
  },
  // Cover less years than next one, ignored for now
  {
    name: 'height_2015_v1-0_z0-12',
    filename: 'mangrove_max_canopy_height_2015_v1-0_z0-12',
    minzoom: 0,
    maxzoom: 12
  },
  {
    name: 'height_2015_v1-0_z0-15',
    filename: 'mangrove_max_canopy_height_2015_v1-0_z0-15',
    minzoom: 0,
    maxzoom: 15
  },
  // Cover less years than next one, ignored for now
  {
    name: 'height_2016_v1-0_z0-12',
    filename: 'mangrove_max_canopy_height_2016_v1-0_z0-12',
    minzoom: 0,
    maxzoom: 12
  },
  {
    name: 'height_2016_v1-0_z0-15',
    filename: 'mangrove_max_canopy_height_2016_v1-0_z0-15',
    minzoom: 0,
    maxzoom: 15
  }
];

const sourcesAndLayers = rasters.reduce((acc, item) => ({
  sources: {
    ...acc.sources,
    [`${item.name}-tiles`]: toRasterSource(item)
  },
  layers: [
    ...acc.layers,
    createLayer(item)
  ]
}), { sources: {}, layers: [] });

const layersMap = {
  biomass: [
    {
      layerId: 'biomass_1996_v1-0_z0-12',
      year: 1996,
      minZoom: 0,
      maxZoom: 12
    },
    {
      layerId: 'biomass_1996_v1-0_z13-15',
      year: 1996,
      minZoom: 13,
      maxZoom: 15
    },
    {
      layerId: 'biomass_2000_v1-2_z0-12',
      year: 2000,
      minZoom: 0,
      maxZoom: 12
    },
    {
      layerId: 'biomass_2000_v1-2_z13-15',
      year: 2000,
      minZoom: 13,
      maxZoom: 15
    },
    {
      layerId: 'biomass_2007_v1-0_z0-12',
      year: 2007,
      minZoom: 0,
      maxZoom: 12
    },
    {
      layerId: 'biomass_2007_v1-0_z13-15',
      year: 2007,
      minZoom: 13,
      maxZoom: 15
    },
    {
      layerId: 'biomass_2008_v1-0_z0-12',
      year: 2008,
      minZoom: 0,
      maxZoom: 12
    },
    {
      layerId: 'biomass_2008_v1-0_z13-15',
      year: 2008,
      minZoom: 13,
      maxZoom: 15
    },
    {
      layerId: 'biomass_2009_v1-0_z0-12',
      year: 2009,
      minZoom: 0,
      maxZoom: 12
    },
    {
      layerId: 'biomass_2009_v1-0_z13-15',
      year: 2009,
      minZoom: 13,
      maxZoom: 15
    },
    {
      layerId: 'biomass_2010_v1-0_z0-12',
      year: 2010,
      minZoom: 0,
      maxZoom: 12
    },
    {
      layerId: 'biomass_2010_v1-0_z13-15',
      year: 2010,
      minZoom: 13,
      maxZoom: 15
    },
    {
      layerId: 'biomass_2015_v1-0_z0-12',
      year: 2015,
      minZoom: 0,
      maxZoom: 12
    },
    {
      layerId: 'biomass_2016_v1-0_z0-12',
      year: 2016,
      minZoom: 0,
      maxZoom: 12
    }
  ],
  height: [
    {
      layerId: 'height_1996_v1-0_z0-12',
      year: 1996,
      minZoom: 0,
      maxZoom: 12
    },
    {
      layerId: 'height_2000_v1-2_z0-13',
      year: 2000,
      minZoom: 0,
      maxZoom: 13
    },
    {
      layerId: 'height_2007_v1-0_z0-12',
      year: 2007,
      minZoom: 0,
      maxZoom: 12
    },
    {
      layerId: 'height_2008_v1-0_z0-12',
      year: 2008,
      minZoom: 0,
      maxZoom: 12
    },
    {
      layerId: 'height_2009_v1-0_z0-12',
      year: 2009,
      minZoom: 0,
      maxZoom: 12
    },
    {
      layerId: 'height_2010_v1-0_z0-15',
      year: 2010,
      minZoom: 0,
      maxZoom: 15
    },
    {
      layerId: 'height_2015_v1-0_z0-15',
      year: 2015,
      minZoom: 0,
      maxZoom: 15
    },
    {
      layerId: 'height_2016_v1-0_z0-15',
      year: 2016,
      minZoom: 0,
      maxZoom: 15
    }
  ]
};

export const scopeFeature = new Map([
  [ 'short', 'ST_Advice'],
  [ 'medium', 'MT_Advice'],
  [ 'long', 'LT_Advice']
]);


export default {
  layersMap,
  ...sourcesAndLayers,
  scopeFeature
};
