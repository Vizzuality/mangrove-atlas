function toRasterSource({ filename, minzoom, maxzoom }) {
  return {
    tiles: [`https://mangrove_atlas.storage.googleapis.com/tilesets/${filename}/{z}/{x}/{y}.png`],
    type: 'raster',
    tileSize: 256,
    minzoom,
    maxzoom
  };
}

function createLayer({name, minzoom, maxzoom }) {
  return {
    id: `${name}-layer`,
    type: 'raster',
    source: name,
    minzoom,
    maxzoom
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

export default rasters.reduce((acc, item) => ({
  sources: {
    ...acc.sources,
    [item.name]: toRasterSource(item)
  },
  layers: [
    ...acc.layers,
    createLayer(item)
  ]
}), { sources: {}, layers: [] });
