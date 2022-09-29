export default {
  dashboards: [
    {
      slug: "distribution_and_change",
      name: "Distribution and Change",
    },
    {
      slug: "restoration_and_conservation",
      name: "Restoration & Conservation",
    },
    {
      slug: "climate_and_policy",
      name: "Climate & Policy",
    },
    {
      slug: "ecosystem_services",
      name: "Ecosystem Services",
    },
    {
      slug: "all_datasets",
      name: "All datasets",
    },
  ],
  widgets: [
    {
      name: "Conservation hotspots",
      slug: "conservation_hotspots",
      locationType: ["custom"],
      categoryIds: ["all_datasets"],
      layersIds: ["cons-hotspots"],
    },
    {
      name: "Highlighted places",
      slug: "highlighted_places",
      locationType: [],
      categoryIds: [],
      layersIds: [],
    },
    {
      name: "Mangrove habitat extent",
      slug: "mangrove_extent",
      locationType: ["custom", "aoi", "wdpa", "country", "worldwide"],
      categoryIds: ["all_datasets", "distribution_and_change"],
      isActive: true,
      layersIds: ["extent"],
    },
    {
      name: "Mangrove net change",
      slug: "mangrove_net_change",
      locationType: ["custom", "aoi", "wdpa", "country", "worldwide"],
      categoryIds: ["all_datasets", "distribution_and_change"],
      layersIds: ["net"],
    },
    {
      name: "Mangrove habitat change",
      slug: "mangrove_activity",
      locationType: ["worldwide"],
      categoryIds: ["all_datasets", "distribution_and_change"],
      layersIds: [],
    },
    {
      name: "Mangrove alerts",
      slug: "mangrove_alerts",
      locationType: ["custom", "aoi", "wdpa", "country", "worldwide"],
      categoryIds: ["all_datasets", "restoration_and_conservation"],
      layersIds: ["alerts-heat"],
    },
    {
      name: "Mangrove Species",
      slug: "mangrove_species",
      locationType: ["country", "worldwide"],
      categoryIds: ["all_datasets", "restoration_and_conservation"],
    },
    {
      name: "Mangrove Protection",
      slug: "mangrove_protection",
      locationType: ["country", "worldwide"],
      categoryIds: ["all_datasets", "restoration_and_conservation"],
    },
    {
      name: "Mangrove Restoration",
      slug: "mangrove_restoration",
      locationType: ["country", "worldwide"],
      categoryIds: [
      ],
      layersIds: ["restoration"],
    },
    {
      name: "Mangrove biomass",
      slug: "mangrove_biomass",
      locationType: ["custom", "aoi", "wdpa", "country", "worldwide"],
      categoryIds: [
        "all_datasets",
        "restoration_and_conservation",
        "ecosystem_services",
      ],
      layersIds: ["biomass"],
    },
    {
      name: "Mangrove height",
      slug: "mangrove_height",
      locationType: ["custom", "aoi", "wdpa", "country", "worldwide"],
      categoryIds: [
        "all_datasets",
        "restoration_and_conservation",
        "ecosystem_services",
      ],
      layersIds: ["height"],
    },
    {
      name: "Mangrove Blue Carbon",
      slug: "mangrove_blue_carbon",
      locationType: ["country", "worldwide"],
      categoryIds: ["all_datasets", "climate_and_policy", "ecosystem_services"],
      layersIds: ["carbon"],
    },
    {
      name: "Mangrove Emissions Mitigation",
      slug: "mangrove_emissions_mitigation",
      locationType: ["custom", "aoi", "wdpa", "country", "worldwide"],
      categoryIds: [],
    },
    {
      name: "Mangrove International Status",
      slug: "mangrove_international_status",
      locationType: ["custom", "aoi", "wdpa", "country", "worldwide"],
      categoryIds: ["all_datasets", "climate_and_policy"],
    },
    {
      name: "Carbon Market Potential",
      slug: "mangrove_investment_potential",
      locationType: ["country"],
      categoryIds: ["all_datasets", "climate_and_policy"],
      layersIds: [],
    },
    {
      name: "Mangrove coverage",
      slug: "mangrove_coverage",
      locationType: [""],
      categoryIds: ["all_datasets", "distribution_and_change"],
      layersIds: ["coverage-1996-2016"],
    },
  ],
  layers: [
    {
      name: "Mangrove coverage",
      id: "coverage-1996-2016",
      mapboxGroup: "0f5c9a8450ae3fcd2174726a3d327ad1",
    },
    {
      name: "Conservation hotspots",
      id: "cons-hotspots",
    },
    {
      name: "Mangrove extent",
      id: "extent",
    },
    {
      name: "Mangrove change",
      id: "net",
    },
    {
      name: "Mangrove restoration",
      id: "restoration",
    },
    {
      name: "Mangrove deforestation alerts",
      id: "alerts-heat",
    },
    {
      name: "Mangrove deforestation alerts",
      id: "alerts-point",
    },
    {
      name: "Mangrove Blue Carbon",
      id: "carbon",
    },
    {
      name: "Height canopy",
      id: "height",
    },
    {
      name: "Mangrove biomass",
      id: "biomass",
    },
  ],
  categories: [
    {
      id: "distribution_and_change",
      name: ["Distribution and Change"],
    },
    {
      id: "restoration_and_conservation",
      name: ["Restoration & Conservation"],
    },
    {
      id: "climate_and_policy",
      name: ["Climate & Policy"],
    },
    {
      id: "ecosystem_services",
      name: ["Ecosystem Services"],
    },
    {
      id: "all_datasets",
      name: ["All datasets"],
    },
  ],
};

