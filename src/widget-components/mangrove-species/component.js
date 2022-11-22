import React, { useEffect } from "react";
import PropTypes from "prop-types";

import ChartWidget from "components/chart-widget";
import SpeciesLegend from "./species-legend";

import config from "./config";

function MangroveSpecies({
  data,
  currentLocation,
  isCollapsed = true,
  slug,
  name,
  addFilter,
  fetchMangroveSpeciesData,
  ...props
}) {
  useEffect(() => {
    fetchMangroveSpeciesData({
      ...(currentLocation?.iso?.toLowerCase() !== "worldwide" && {
        location_id: currentLocation.id,
      }),
    });
  }, [currentLocation, fetchMangroveSpeciesData]);

  useEffect(() => {
    addFilter({
      filter: {
        id: "species",
      },
    });
  }, [addFilter]);

  const { threatened, total } = data;

  const { chartData, chartConfig } = config.parse(data);

  const locationName =
    currentLocation.location_type === "worldwide" ? (
      "The world"
    ) : (
      <span className="notranslate">{`${currentLocation?.name}`}</span>
    );

  const article = threatened === 1 ? "is" : "are";

  const sentence = (
    <>
      <strong>{locationName} </strong>has <strong>{total}</strong> species of
      mangroves. Of them, <strong>{threatened !== 0 ? threatened : 'none'}</strong> {article} considered
      <strong> threatened</strong> by the IUCN Red List.
    </>
  );

  const widgetData = {
    data: chartData,
    config: chartConfig,
  };

  if (!chartData || !chartData.length || !data) {
    return null;
  }

  return (
    <ChartWidget
      name={name}
      data={chartData}
      slug={slug}
      filename={slug}
      isCollapsed={isCollapsed}
      sentence={sentence}
      chartData={widgetData}
      hasFlexibleLegend={true}
      component={<SpeciesLegend data={chartData} groups={{
        "CR - Critically Endangered": [
            {
                "type": "rect",
                "value": "CR - Critically Endangered",
                "color": "#D51E08",
                "payload": {
                    "percent": 0.03125,
                    "name": "CR - Critically Endangered",
                    "tooltipPayload": [
                        {
                            "name": "CR - Critically Endangered",
                            "value": 3.125,
                            "payload": {
                                "payload": {
                                    "value": 2,
                                    "color": "#D51E08",
                                    "percentage": 3.125,
                                    "label": "CR - Critically Endangered",
                                    "species": [
                                        {
                                            "id": 60,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Sonneratia griffithii",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Sonneratia%20griffithii&searchType=species",
                                            "red_list_cat": "cr"
                                        },
                                        {
                                            "id": 23,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Bruguiera hainesii",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Bruguiera%20hainesii&searchType=species",
                                            "red_list_cat": "cr"
                                        }
                                    ]
                                },
                                "stroke": "#D51E08",
                                "fill": "#D51E08",
                                "value": 2,
                                "color": "#D51E08",
                                "percentage": 3.125,
                                "label": "CR - Critically Endangered",
                                "species": [
                                    {
                                        "id": 60,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Sonneratia griffithii",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Sonneratia%20griffithii&searchType=species",
                                        "red_list_cat": "cr"
                                    },
                                    {
                                        "id": 23,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Bruguiera hainesii",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Bruguiera%20hainesii&searchType=species",
                                        "red_list_cat": "cr"
                                    }
                                ]
                            },
                            "dataKey": "percentage"
                        }
                    ],
                    "midAngle": 5.4375,
                    "middleRadius": 80.5,
                    "tooltipPosition": {
                        "x": 437.8940126889642,
                        "y": 127.3718291047423
                    },
                    "payload": {
                        "payload": {
                            "value": 2,
                            "color": "#D51E08",
                            "percentage": 3.125,
                            "label": "CR - Critically Endangered",
                            "species": [
                                {
                                    "id": 60,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Sonneratia griffithii",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Sonneratia%20griffithii&searchType=species",
                                    "red_list_cat": "cr"
                                },
                                {
                                    "id": 23,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Bruguiera hainesii",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Bruguiera%20hainesii&searchType=species",
                                    "red_list_cat": "cr"
                                }
                            ]
                        },
                        "stroke": "#D51E08",
                        "fill": "#D51E08",
                        "value": 2,
                        "color": "#D51E08",
                        "percentage": 3.125,
                        "label": "CR - Critically Endangered",
                        "species": [
                            {
                                "id": 60,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Sonneratia griffithii",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Sonneratia%20griffithii&searchType=species",
                                "red_list_cat": "cr"
                            },
                            {
                                "id": 23,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Bruguiera hainesii",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Bruguiera%20hainesii&searchType=species",
                                "red_list_cat": "cr"
                            }
                        ]
                    },
                    "stroke": "#D51E08",
                    "fill": "#D51E08",
                    "value": 3.125,
                    "color": "#D51E08",
                    "percentage": 3.125,
                    "label": "CR - Critically Endangered",
                    "species": [
                        {
                            "id": 60,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Sonneratia griffithii",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Sonneratia%20griffithii&searchType=species",
                            "red_list_cat": "cr"
                        },
                        {
                            "id": 23,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Bruguiera hainesii",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Bruguiera%20hainesii&searchType=species",
                            "red_list_cat": "cr"
                        }
                    ],
                    "cx": 357.75625,
                    "cy": 135,
                    "innerRadius": 63.25,
                    "outerRadius": 97.75,
                    "maxRadius": 171.92742116071148,
                    "startAngle": 0,
                    "endAngle": 10.875,
                    "paddingAngle": 2
                }
            }
        ],
        "EN - Endangered": [
            {
                "type": "rect",
                "value": "EN - Endangered",
                "color": "#FC7F3F",
                "payload": {
                    "percent": 0.046875,
                    "name": "EN - Endangered",
                    "tooltipPayload": [
                        {
                            "name": "EN - Endangered",
                            "value": 4.6875,
                            "payload": {
                                "payload": {
                                    "value": 3,
                                    "color": "#FC7F3F",
                                    "percentage": 4.6875,
                                    "label": "EN - Endangered",
                                    "species": [
                                        {
                                            "id": 37,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Heritiera fomes",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Heritiera%20fomes&searchType=species",
                                            "red_list_cat": "en"
                                        },
                                        {
                                            "id": 26,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Camptostemon philippinense",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Camptostemon%20philippinense&searchType=species",
                                            "red_list_cat": "en"
                                        },
                                        {
                                            "id": 38,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Heritiera globosa",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Heritiera%20globosa&searchType=species",
                                            "red_list_cat": "en"
                                        }
                                    ]
                                },
                                "stroke": "#FC7F3F",
                                "fill": "#FC7F3F",
                                "value": 3,
                                "color": "#FC7F3F",
                                "percentage": 4.6875,
                                "label": "EN - Endangered",
                                "species": [
                                    {
                                        "id": 37,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Heritiera fomes",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Heritiera%20fomes&searchType=species",
                                        "red_list_cat": "en"
                                    },
                                    {
                                        "id": 26,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Camptostemon philippinense",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Camptostemon%20philippinense&searchType=species",
                                        "red_list_cat": "en"
                                    },
                                    {
                                        "id": 38,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Heritiera globosa",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Heritiera%20globosa&searchType=species",
                                        "red_list_cat": "en"
                                    }
                                ]
                            },
                            "dataKey": "percentage"
                        }
                    ],
                    "midAngle": 21.03125,
                    "middleRadius": 80.5,
                    "tooltipPosition": {
                        "x": 432.89372867426096,
                        "y": 106.11039462929647
                    },
                    "payload": {
                        "payload": {
                            "value": 3,
                            "color": "#FC7F3F",
                            "percentage": 4.6875,
                            "label": "EN - Endangered",
                            "species": [
                                {
                                    "id": 37,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Heritiera fomes",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Heritiera%20fomes&searchType=species",
                                    "red_list_cat": "en"
                                },
                                {
                                    "id": 26,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Camptostemon philippinense",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Camptostemon%20philippinense&searchType=species",
                                    "red_list_cat": "en"
                                },
                                {
                                    "id": 38,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Heritiera globosa",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Heritiera%20globosa&searchType=species",
                                    "red_list_cat": "en"
                                }
                            ]
                        },
                        "stroke": "#FC7F3F",
                        "fill": "#FC7F3F",
                        "value": 3,
                        "color": "#FC7F3F",
                        "percentage": 4.6875,
                        "label": "EN - Endangered",
                        "species": [
                            {
                                "id": 37,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Heritiera fomes",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Heritiera%20fomes&searchType=species",
                                "red_list_cat": "en"
                            },
                            {
                                "id": 26,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Camptostemon philippinense",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Camptostemon%20philippinense&searchType=species",
                                "red_list_cat": "en"
                            },
                            {
                                "id": 38,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Heritiera globosa",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Heritiera%20globosa&searchType=species",
                                "red_list_cat": "en"
                            }
                        ]
                    },
                    "stroke": "#FC7F3F",
                    "fill": "#FC7F3F",
                    "value": 4.6875,
                    "color": "#FC7F3F",
                    "percentage": 4.6875,
                    "label": "EN - Endangered",
                    "species": [
                        {
                            "id": 37,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Heritiera fomes",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Heritiera%20fomes&searchType=species",
                            "red_list_cat": "en"
                        },
                        {
                            "id": 26,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Camptostemon philippinense",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Camptostemon%20philippinense&searchType=species",
                            "red_list_cat": "en"
                        },
                        {
                            "id": 38,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Heritiera globosa",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Heritiera%20globosa&searchType=species",
                            "red_list_cat": "en"
                        }
                    ],
                    "cx": 357.75625,
                    "cy": 135,
                    "innerRadius": 63.25,
                    "outerRadius": 97.75,
                    "maxRadius": 171.92742116071148,
                    "startAngle": 12.875,
                    "endAngle": 29.1875,
                    "paddingAngle": 2
                }
            }
        ],
        "VU - Vulnerable": [
            {
                "type": "rect",
                "value": "VU - Vulnerable",
                "color": "#FAE811",
                "payload": {
                    "percent": 0.109375,
                    "name": "VU - Vulnerable",
                    "tooltipPayload": [
                        {
                            "name": "VU - Vulnerable",
                            "value": 10.9375,
                            "payload": {
                                "payload": {
                                    "value": 7,
                                    "color": "#FAE811",
                                    "percentage": 10.9375,
                                    "label": "VU - Vulnerable",
                                    "species": [
                                        {
                                            "id": 15,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Avicennia integra",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20integra&searchType=species",
                                            "red_list_cat": "vu"
                                        },
                                        {
                                            "id": 13,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Avicennia bicolor",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20bicolor&searchType=species",
                                            "red_list_cat": "vu"
                                        },
                                        {
                                            "id": 45,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Mora oleifera",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Mora%20oleifera&searchType=species",
                                            "red_list_cat": "vu"
                                        },
                                        {
                                            "id": 48,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Pelliciera rhizophorae",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Pelliciera%20rhizophorae&searchType=species",
                                            "red_list_cat": "vu"
                                        },
                                        {
                                            "id": 63,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Tabebuia palustris",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Tabebuia%20palustris&searchType=species",
                                            "red_list_cat": "vu"
                                        },
                                        {
                                            "id": 18,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Avicennia rumphiana",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20rumphiana&searchType=species",
                                            "red_list_cat": "vu"
                                        },
                                        {
                                            "id": 33,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Diospyros littorea",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Diospyros%20littorea&searchType=species",
                                            "red_list_cat": "vu"
                                        }
                                    ]
                                },
                                "stroke": "#FAE811",
                                "fill": "#FAE811",
                                "value": 7,
                                "color": "#FAE811",
                                "percentage": 10.9375,
                                "label": "VU - Vulnerable",
                                "species": [
                                    {
                                        "id": 15,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Avicennia integra",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20integra&searchType=species",
                                        "red_list_cat": "vu"
                                    },
                                    {
                                        "id": 13,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Avicennia bicolor",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20bicolor&searchType=species",
                                        "red_list_cat": "vu"
                                    },
                                    {
                                        "id": 45,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Mora oleifera",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Mora%20oleifera&searchType=species",
                                        "red_list_cat": "vu"
                                    },
                                    {
                                        "id": 48,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Pelliciera rhizophorae",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Pelliciera%20rhizophorae&searchType=species",
                                        "red_list_cat": "vu"
                                    },
                                    {
                                        "id": 63,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Tabebuia palustris",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Tabebuia%20palustris&searchType=species",
                                        "red_list_cat": "vu"
                                    },
                                    {
                                        "id": 18,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Avicennia rumphiana",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20rumphiana&searchType=species",
                                        "red_list_cat": "vu"
                                    },
                                    {
                                        "id": 33,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Diospyros littorea",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Diospyros%20littorea&searchType=species",
                                        "red_list_cat": "vu"
                                    }
                                ]
                            },
                            "dataKey": "percentage"
                        }
                    ],
                    "midAngle": 50.21875,
                    "middleRadius": 80.5,
                    "tooltipPosition": {
                        "x": 409.26483872402497,
                        "y": 73.13631689222464
                    },
                    "payload": {
                        "payload": {
                            "value": 7,
                            "color": "#FAE811",
                            "percentage": 10.9375,
                            "label": "VU - Vulnerable",
                            "species": [
                                {
                                    "id": 15,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Avicennia integra",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20integra&searchType=species",
                                    "red_list_cat": "vu"
                                },
                                {
                                    "id": 13,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Avicennia bicolor",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20bicolor&searchType=species",
                                    "red_list_cat": "vu"
                                },
                                {
                                    "id": 45,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Mora oleifera",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Mora%20oleifera&searchType=species",
                                    "red_list_cat": "vu"
                                },
                                {
                                    "id": 48,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Pelliciera rhizophorae",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Pelliciera%20rhizophorae&searchType=species",
                                    "red_list_cat": "vu"
                                },
                                {
                                    "id": 63,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Tabebuia palustris",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Tabebuia%20palustris&searchType=species",
                                    "red_list_cat": "vu"
                                },
                                {
                                    "id": 18,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Avicennia rumphiana",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20rumphiana&searchType=species",
                                    "red_list_cat": "vu"
                                },
                                {
                                    "id": 33,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Diospyros littorea",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Diospyros%20littorea&searchType=species",
                                    "red_list_cat": "vu"
                                }
                            ]
                        },
                        "stroke": "#FAE811",
                        "fill": "#FAE811",
                        "value": 7,
                        "color": "#FAE811",
                        "percentage": 10.9375,
                        "label": "VU - Vulnerable",
                        "species": [
                            {
                                "id": 15,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Avicennia integra",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20integra&searchType=species",
                                "red_list_cat": "vu"
                            },
                            {
                                "id": 13,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Avicennia bicolor",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20bicolor&searchType=species",
                                "red_list_cat": "vu"
                            },
                            {
                                "id": 45,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Mora oleifera",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Mora%20oleifera&searchType=species",
                                "red_list_cat": "vu"
                            },
                            {
                                "id": 48,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Pelliciera rhizophorae",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Pelliciera%20rhizophorae&searchType=species",
                                "red_list_cat": "vu"
                            },
                            {
                                "id": 63,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Tabebuia palustris",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Tabebuia%20palustris&searchType=species",
                                "red_list_cat": "vu"
                            },
                            {
                                "id": 18,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Avicennia rumphiana",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20rumphiana&searchType=species",
                                "red_list_cat": "vu"
                            },
                            {
                                "id": 33,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Diospyros littorea",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Diospyros%20littorea&searchType=species",
                                "red_list_cat": "vu"
                            }
                        ]
                    },
                    "stroke": "#FAE811",
                    "fill": "#FAE811",
                    "value": 10.9375,
                    "color": "#FAE811",
                    "percentage": 10.9375,
                    "label": "VU - Vulnerable",
                    "species": [
                        {
                            "id": 15,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Avicennia integra",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20integra&searchType=species",
                            "red_list_cat": "vu"
                        },
                        {
                            "id": 13,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Avicennia bicolor",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20bicolor&searchType=species",
                            "red_list_cat": "vu"
                        },
                        {
                            "id": 45,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Mora oleifera",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Mora%20oleifera&searchType=species",
                            "red_list_cat": "vu"
                        },
                        {
                            "id": 48,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Pelliciera rhizophorae",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Pelliciera%20rhizophorae&searchType=species",
                            "red_list_cat": "vu"
                        },
                        {
                            "id": 63,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Tabebuia palustris",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Tabebuia%20palustris&searchType=species",
                            "red_list_cat": "vu"
                        },
                        {
                            "id": 18,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Avicennia rumphiana",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20rumphiana&searchType=species",
                            "red_list_cat": "vu"
                        },
                        {
                            "id": 33,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Diospyros littorea",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Diospyros%20littorea&searchType=species",
                            "red_list_cat": "vu"
                        }
                    ],
                    "cx": 357.75625,
                    "cy": 135,
                    "innerRadius": 63.25,
                    "outerRadius": 97.75,
                    "maxRadius": 171.92742116071148,
                    "startAngle": 31.1875,
                    "endAngle": 69.25,
                    "paddingAngle": 2
                }
            }
        ],
        "NT - Near Threatened": [
            {
                "type": "rect",
                "value": "NT - Near Threatened",
                "color": "#CCE227",
                "payload": {
                    "percent": 0.078125,
                    "name": "NT - Near Threatened",
                    "tooltipPayload": [
                        {
                            "name": "NT - Near Threatened",
                            "value": 7.8125,
                            "payload": {
                                "payload": {
                                    "value": 5,
                                    "color": "#CCE227",
                                    "percentage": 7.8125,
                                    "label": "NT - Near Threatened",
                                    "species": [
                                        {
                                            "id": 54,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Rhizophora samoensis",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Rhizophora%20samoensis&searchType=species",
                                            "red_list_cat": "nt"
                                        },
                                        {
                                            "id": 62,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Sonneratia ovata",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Sonneratia%20ovata&searchType=species",
                                            "red_list_cat": "nt"
                                        },
                                        {
                                            "id": 8,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Aegialitis rotundifolia",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Aegialitis%20rotundifolia&searchType=species",
                                            "red_list_cat": "nt"
                                        },
                                        {
                                            "id": 29,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Ceriops decandra",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Ceriops%20decandra&searchType=species",
                                            "red_list_cat": "nt"
                                        },
                                        {
                                            "id": 10,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Aegiceras floridum",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Aegiceras%20floridum&searchType=species",
                                            "red_list_cat": "nt"
                                        }
                                    ]
                                },
                                "stroke": "#CCE227",
                                "fill": "#CCE227",
                                "value": 5,
                                "color": "#CCE227",
                                "percentage": 7.8125,
                                "label": "NT - Near Threatened",
                                "species": [
                                    {
                                        "id": 54,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Rhizophora samoensis",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Rhizophora%20samoensis&searchType=species",
                                        "red_list_cat": "nt"
                                    },
                                    {
                                        "id": 62,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Sonneratia ovata",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Sonneratia%20ovata&searchType=species",
                                        "red_list_cat": "nt"
                                    },
                                    {
                                        "id": 8,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Aegialitis rotundifolia",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Aegialitis%20rotundifolia&searchType=species",
                                        "red_list_cat": "nt"
                                    },
                                    {
                                        "id": 29,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Ceriops decandra",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Ceriops%20decandra&searchType=species",
                                        "red_list_cat": "nt"
                                    },
                                    {
                                        "id": 10,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Aegiceras floridum",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Aegiceras%20floridum&searchType=species",
                                        "red_list_cat": "nt"
                                    }
                                ]
                            },
                            "dataKey": "percentage"
                        }
                    ],
                    "midAngle": 84.84375,
                    "middleRadius": 80.5,
                    "tooltipPosition": {
                        "x": 364.99095524938843,
                        "y": 54.82575825145291
                    },
                    "payload": {
                        "payload": {
                            "value": 5,
                            "color": "#CCE227",
                            "percentage": 7.8125,
                            "label": "NT - Near Threatened",
                            "species": [
                                {
                                    "id": 54,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Rhizophora samoensis",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Rhizophora%20samoensis&searchType=species",
                                    "red_list_cat": "nt"
                                },
                                {
                                    "id": 62,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Sonneratia ovata",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Sonneratia%20ovata&searchType=species",
                                    "red_list_cat": "nt"
                                },
                                {
                                    "id": 8,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Aegialitis rotundifolia",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Aegialitis%20rotundifolia&searchType=species",
                                    "red_list_cat": "nt"
                                },
                                {
                                    "id": 29,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Ceriops decandra",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Ceriops%20decandra&searchType=species",
                                    "red_list_cat": "nt"
                                },
                                {
                                    "id": 10,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Aegiceras floridum",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Aegiceras%20floridum&searchType=species",
                                    "red_list_cat": "nt"
                                }
                            ]
                        },
                        "stroke": "#CCE227",
                        "fill": "#CCE227",
                        "value": 5,
                        "color": "#CCE227",
                        "percentage": 7.8125,
                        "label": "NT - Near Threatened",
                        "species": [
                            {
                                "id": 54,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Rhizophora samoensis",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Rhizophora%20samoensis&searchType=species",
                                "red_list_cat": "nt"
                            },
                            {
                                "id": 62,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Sonneratia ovata",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Sonneratia%20ovata&searchType=species",
                                "red_list_cat": "nt"
                            },
                            {
                                "id": 8,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Aegialitis rotundifolia",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Aegialitis%20rotundifolia&searchType=species",
                                "red_list_cat": "nt"
                            },
                            {
                                "id": 29,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Ceriops decandra",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Ceriops%20decandra&searchType=species",
                                "red_list_cat": "nt"
                            },
                            {
                                "id": 10,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Aegiceras floridum",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Aegiceras%20floridum&searchType=species",
                                "red_list_cat": "nt"
                            }
                        ]
                    },
                    "stroke": "#CCE227",
                    "fill": "#CCE227",
                    "value": 7.8125,
                    "color": "#CCE227",
                    "percentage": 7.8125,
                    "label": "NT - Near Threatened",
                    "species": [
                        {
                            "id": 54,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Rhizophora samoensis",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Rhizophora%20samoensis&searchType=species",
                            "red_list_cat": "nt"
                        },
                        {
                            "id": 62,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Sonneratia ovata",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Sonneratia%20ovata&searchType=species",
                            "red_list_cat": "nt"
                        },
                        {
                            "id": 8,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Aegialitis rotundifolia",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Aegialitis%20rotundifolia&searchType=species",
                            "red_list_cat": "nt"
                        },
                        {
                            "id": 29,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Ceriops decandra",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Ceriops%20decandra&searchType=species",
                            "red_list_cat": "nt"
                        },
                        {
                            "id": 10,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Aegiceras floridum",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Aegiceras%20floridum&searchType=species",
                            "red_list_cat": "nt"
                        }
                    ],
                    "cx": 357.75625,
                    "cy": 135,
                    "innerRadius": 63.25,
                    "outerRadius": 97.75,
                    "maxRadius": 171.92742116071148,
                    "startAngle": 71.25,
                    "endAngle": 98.4375,
                    "paddingAngle": 2
                }
            }
        ],
        "LC - Least Concern": [
            {
                "type": "rect",
                "value": "LC - Least Concern",
                "color": "#61C55A",
                "payload": {
                    "percent": 0.703125,
                    "name": "LC - Least Concern",
                    "tooltipPayload": [
                        {
                            "name": "LC - Least Concern",
                            "value": 70.3125,
                            "payload": {
                                "payload": {
                                    "value": 45,
                                    "color": "#61C55A",
                                    "percentage": 70.3125,
                                    "label": "LC - Least Concern",
                                    "species": [
                                        {
                                            "id": 6,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Acrostichum speciosum",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Acrostichum%20speciosum&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 22,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Bruguiera gymnorhiza",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Bruguiera%20gymnorhiza&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 49,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Pemphis acidula",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Pemphis%20acidula&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 4,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Acrostichum aureum",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Acrostichum%20aureum&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 5,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Acrostichum danaeifolium",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Acrostichum%20danaeifolium&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 14,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Avicennia germinans",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20germinans&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 31,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Conocarpus erectus",
                                            "common_name": "Silver-leaved Buttonwood",
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Conocarpus%20erectus&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 42,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Laguncularia racemosa",
                                            "common_name": "White Mangrove",
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Laguncularia%20racemosa&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 51,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Rhizophora mangle",
                                            "common_name": "Red Mangrove",
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Rhizophora%20mangle&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 53,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Rhizophora racemosa",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Rhizophora%20racemosa&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 19,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Avicennia schaueriana",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20schaueriana&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 2,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Acanthus ebracteatus",
                                            "common_name": "Holy Mangrove",
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Acanthus%20ebracteatus&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 3,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Acanthus ilicifolius",
                                            "common_name": "Holy Mangrove",
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Acanthus%20ilicifolius&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 7,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Aegialitis annulata",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Aegialitis%20annulata&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 9,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Aegiceras corniculatum",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Aegiceras%20corniculatum&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 16,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Avicennia marina",
                                            "common_name": "Grey Mangrove",
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20marina&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 20,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Bruguiera cylindrica",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Bruguiera%20cylindrica&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 21,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Bruguiera exaristata",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Bruguiera%20exaristata&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 24,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Bruguiera parviflora",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Bruguiera%20parviflora&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 25,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Bruguiera sexangula",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Bruguiera%20sexangula&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 27,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Camptostemon schultzii",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Camptostemon%20schultzii&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 28,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Ceriops australis",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Ceriops%20australis&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 30,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Ceriops tagal",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Ceriops%20tagal&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 32,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Cynometra iripa",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Cynometra%20iripa&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 34,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Dolichandrone spathacea",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Dolichandrone%20spathacea&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 35,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Excoecaria agallocha",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Excoecaria%20agallocha&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 39,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Heritiera littoralis",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Heritiera%20littoralis&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 43,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Lumnitzera littorea",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Lumnitzera%20littorea&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 44,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Lumnitzera racemosa",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Lumnitzera%20racemosa&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 46,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Nypa fruticans",
                                            "common_name": "Nypa Palm",
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Nypa%20fruticans&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 47,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Osbornia octodonta",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Osbornia%20octodonta&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 50,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Rhizophora apiculata",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Rhizophora%20apiculata&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 52,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Rhizophora mucronata",
                                            "common_name": "True Mangrove",
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Rhizophora%20mucronata&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 55,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Rhizophora stylosa",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Rhizophora%20stylosa&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 56,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Scyphiphora hydrophylacea",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Scyphiphora%20hydrophylacea&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 57,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Sonneratia alba",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Sonneratia%20alba&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 59,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Sonneratia caseolaris",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Sonneratia%20caseolaris&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 61,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Sonneratia lanceolata",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Sonneratia%20lanceolata&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 64,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Xylocarpus granatum",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Xylocarpus%20granatum&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 65,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Xylocarpus moluccensis",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Xylocarpus%20moluccensis&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 12,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Avicennia alba",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20alba&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 17,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Avicennia officinalis",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20officinalis&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 40,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Kandelia candel",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Kandelia%20candel&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 58,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Sonneratia apetala",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Sonneratia%20apetala&searchType=species",
                                            "red_list_cat": "lc"
                                        },
                                        {
                                            "id": 41,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Kandelia obovata",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Kandelia%20obovata&searchType=species",
                                            "red_list_cat": "lc"
                                        }
                                    ]
                                },
                                "stroke": "#61C55A",
                                "fill": "#61C55A",
                                "value": 45,
                                "color": "#61C55A",
                                "percentage": 70.3125,
                                "label": "LC - Least Concern",
                                "species": [
                                    {
                                        "id": 6,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Acrostichum speciosum",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Acrostichum%20speciosum&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 22,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Bruguiera gymnorhiza",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Bruguiera%20gymnorhiza&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 49,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Pemphis acidula",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Pemphis%20acidula&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 4,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Acrostichum aureum",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Acrostichum%20aureum&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 5,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Acrostichum danaeifolium",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Acrostichum%20danaeifolium&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 14,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Avicennia germinans",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20germinans&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 31,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Conocarpus erectus",
                                        "common_name": "Silver-leaved Buttonwood",
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Conocarpus%20erectus&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 42,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Laguncularia racemosa",
                                        "common_name": "White Mangrove",
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Laguncularia%20racemosa&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 51,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Rhizophora mangle",
                                        "common_name": "Red Mangrove",
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Rhizophora%20mangle&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 53,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Rhizophora racemosa",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Rhizophora%20racemosa&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 19,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Avicennia schaueriana",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20schaueriana&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 2,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Acanthus ebracteatus",
                                        "common_name": "Holy Mangrove",
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Acanthus%20ebracteatus&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 3,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Acanthus ilicifolius",
                                        "common_name": "Holy Mangrove",
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Acanthus%20ilicifolius&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 7,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Aegialitis annulata",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Aegialitis%20annulata&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 9,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Aegiceras corniculatum",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Aegiceras%20corniculatum&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 16,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Avicennia marina",
                                        "common_name": "Grey Mangrove",
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20marina&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 20,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Bruguiera cylindrica",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Bruguiera%20cylindrica&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 21,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Bruguiera exaristata",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Bruguiera%20exaristata&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 24,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Bruguiera parviflora",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Bruguiera%20parviflora&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 25,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Bruguiera sexangula",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Bruguiera%20sexangula&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 27,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Camptostemon schultzii",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Camptostemon%20schultzii&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 28,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Ceriops australis",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Ceriops%20australis&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 30,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Ceriops tagal",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Ceriops%20tagal&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 32,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Cynometra iripa",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Cynometra%20iripa&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 34,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Dolichandrone spathacea",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Dolichandrone%20spathacea&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 35,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Excoecaria agallocha",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Excoecaria%20agallocha&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 39,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Heritiera littoralis",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Heritiera%20littoralis&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 43,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Lumnitzera littorea",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Lumnitzera%20littorea&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 44,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Lumnitzera racemosa",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Lumnitzera%20racemosa&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 46,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Nypa fruticans",
                                        "common_name": "Nypa Palm",
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Nypa%20fruticans&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 47,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Osbornia octodonta",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Osbornia%20octodonta&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 50,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Rhizophora apiculata",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Rhizophora%20apiculata&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 52,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Rhizophora mucronata",
                                        "common_name": "True Mangrove",
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Rhizophora%20mucronata&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 55,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Rhizophora stylosa",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Rhizophora%20stylosa&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 56,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Scyphiphora hydrophylacea",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Scyphiphora%20hydrophylacea&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 57,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Sonneratia alba",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Sonneratia%20alba&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 59,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Sonneratia caseolaris",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Sonneratia%20caseolaris&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 61,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Sonneratia lanceolata",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Sonneratia%20lanceolata&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 64,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Xylocarpus granatum",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Xylocarpus%20granatum&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 65,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Xylocarpus moluccensis",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Xylocarpus%20moluccensis&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 12,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Avicennia alba",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20alba&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 17,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Avicennia officinalis",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20officinalis&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 40,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Kandelia candel",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Kandelia%20candel&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 58,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Sonneratia apetala",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Sonneratia%20apetala&searchType=species",
                                        "red_list_cat": "lc"
                                    },
                                    {
                                        "id": 41,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Kandelia obovata",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Kandelia%20obovata&searchType=species",
                                        "red_list_cat": "lc"
                                    }
                                ]
                            },
                            "dataKey": "percentage"
                        }
                    ],
                    "midAngle": 222.78125,
                    "middleRadius": 80.5,
                    "tooltipPosition": {
                        "x": 298.6731001654743,
                        "y": 189.6756930054936
                    },
                    "payload": {
                        "payload": {
                            "value": 45,
                            "color": "#61C55A",
                            "percentage": 70.3125,
                            "label": "LC - Least Concern",
                            "species": [
                                {
                                    "id": 6,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Acrostichum speciosum",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Acrostichum%20speciosum&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 22,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Bruguiera gymnorhiza",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Bruguiera%20gymnorhiza&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 49,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Pemphis acidula",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Pemphis%20acidula&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 4,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Acrostichum aureum",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Acrostichum%20aureum&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 5,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Acrostichum danaeifolium",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Acrostichum%20danaeifolium&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 14,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Avicennia germinans",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20germinans&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 31,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Conocarpus erectus",
                                    "common_name": "Silver-leaved Buttonwood",
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Conocarpus%20erectus&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 42,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Laguncularia racemosa",
                                    "common_name": "White Mangrove",
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Laguncularia%20racemosa&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 51,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Rhizophora mangle",
                                    "common_name": "Red Mangrove",
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Rhizophora%20mangle&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 53,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Rhizophora racemosa",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Rhizophora%20racemosa&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 19,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Avicennia schaueriana",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20schaueriana&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 2,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Acanthus ebracteatus",
                                    "common_name": "Holy Mangrove",
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Acanthus%20ebracteatus&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 3,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Acanthus ilicifolius",
                                    "common_name": "Holy Mangrove",
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Acanthus%20ilicifolius&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 7,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Aegialitis annulata",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Aegialitis%20annulata&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 9,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Aegiceras corniculatum",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Aegiceras%20corniculatum&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 16,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Avicennia marina",
                                    "common_name": "Grey Mangrove",
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20marina&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 20,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Bruguiera cylindrica",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Bruguiera%20cylindrica&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 21,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Bruguiera exaristata",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Bruguiera%20exaristata&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 24,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Bruguiera parviflora",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Bruguiera%20parviflora&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 25,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Bruguiera sexangula",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Bruguiera%20sexangula&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 27,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Camptostemon schultzii",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Camptostemon%20schultzii&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 28,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Ceriops australis",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Ceriops%20australis&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 30,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Ceriops tagal",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Ceriops%20tagal&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 32,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Cynometra iripa",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Cynometra%20iripa&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 34,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Dolichandrone spathacea",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Dolichandrone%20spathacea&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 35,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Excoecaria agallocha",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Excoecaria%20agallocha&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 39,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Heritiera littoralis",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Heritiera%20littoralis&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 43,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Lumnitzera littorea",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Lumnitzera%20littorea&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 44,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Lumnitzera racemosa",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Lumnitzera%20racemosa&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 46,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Nypa fruticans",
                                    "common_name": "Nypa Palm",
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Nypa%20fruticans&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 47,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Osbornia octodonta",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Osbornia%20octodonta&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 50,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Rhizophora apiculata",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Rhizophora%20apiculata&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 52,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Rhizophora mucronata",
                                    "common_name": "True Mangrove",
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Rhizophora%20mucronata&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 55,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Rhizophora stylosa",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Rhizophora%20stylosa&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 56,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Scyphiphora hydrophylacea",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Scyphiphora%20hydrophylacea&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 57,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Sonneratia alba",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Sonneratia%20alba&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 59,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Sonneratia caseolaris",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Sonneratia%20caseolaris&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 61,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Sonneratia lanceolata",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Sonneratia%20lanceolata&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 64,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Xylocarpus granatum",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Xylocarpus%20granatum&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 65,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Xylocarpus moluccensis",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Xylocarpus%20moluccensis&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 12,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Avicennia alba",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20alba&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 17,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Avicennia officinalis",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20officinalis&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 40,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Kandelia candel",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Kandelia%20candel&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 58,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Sonneratia apetala",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Sonneratia%20apetala&searchType=species",
                                    "red_list_cat": "lc"
                                },
                                {
                                    "id": 41,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Kandelia obovata",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Kandelia%20obovata&searchType=species",
                                    "red_list_cat": "lc"
                                }
                            ]
                        },
                        "stroke": "#61C55A",
                        "fill": "#61C55A",
                        "value": 45,
                        "color": "#61C55A",
                        "percentage": 70.3125,
                        "label": "LC - Least Concern",
                        "species": [
                            {
                                "id": 6,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Acrostichum speciosum",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Acrostichum%20speciosum&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 22,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Bruguiera gymnorhiza",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Bruguiera%20gymnorhiza&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 49,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Pemphis acidula",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Pemphis%20acidula&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 4,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Acrostichum aureum",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Acrostichum%20aureum&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 5,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Acrostichum danaeifolium",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Acrostichum%20danaeifolium&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 14,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Avicennia germinans",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20germinans&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 31,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Conocarpus erectus",
                                "common_name": "Silver-leaved Buttonwood",
                                "iucn_url": "https://www.iucnredlist.org/search?query=Conocarpus%20erectus&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 42,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Laguncularia racemosa",
                                "common_name": "White Mangrove",
                                "iucn_url": "https://www.iucnredlist.org/search?query=Laguncularia%20racemosa&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 51,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Rhizophora mangle",
                                "common_name": "Red Mangrove",
                                "iucn_url": "https://www.iucnredlist.org/search?query=Rhizophora%20mangle&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 53,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Rhizophora racemosa",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Rhizophora%20racemosa&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 19,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Avicennia schaueriana",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20schaueriana&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 2,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Acanthus ebracteatus",
                                "common_name": "Holy Mangrove",
                                "iucn_url": "https://www.iucnredlist.org/search?query=Acanthus%20ebracteatus&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 3,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Acanthus ilicifolius",
                                "common_name": "Holy Mangrove",
                                "iucn_url": "https://www.iucnredlist.org/search?query=Acanthus%20ilicifolius&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 7,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Aegialitis annulata",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Aegialitis%20annulata&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 9,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Aegiceras corniculatum",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Aegiceras%20corniculatum&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 16,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Avicennia marina",
                                "common_name": "Grey Mangrove",
                                "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20marina&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 20,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Bruguiera cylindrica",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Bruguiera%20cylindrica&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 21,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Bruguiera exaristata",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Bruguiera%20exaristata&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 24,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Bruguiera parviflora",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Bruguiera%20parviflora&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 25,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Bruguiera sexangula",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Bruguiera%20sexangula&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 27,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Camptostemon schultzii",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Camptostemon%20schultzii&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 28,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Ceriops australis",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Ceriops%20australis&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 30,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Ceriops tagal",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Ceriops%20tagal&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 32,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Cynometra iripa",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Cynometra%20iripa&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 34,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Dolichandrone spathacea",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Dolichandrone%20spathacea&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 35,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Excoecaria agallocha",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Excoecaria%20agallocha&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 39,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Heritiera littoralis",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Heritiera%20littoralis&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 43,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Lumnitzera littorea",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Lumnitzera%20littorea&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 44,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Lumnitzera racemosa",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Lumnitzera%20racemosa&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 46,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Nypa fruticans",
                                "common_name": "Nypa Palm",
                                "iucn_url": "https://www.iucnredlist.org/search?query=Nypa%20fruticans&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 47,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Osbornia octodonta",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Osbornia%20octodonta&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 50,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Rhizophora apiculata",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Rhizophora%20apiculata&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 52,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Rhizophora mucronata",
                                "common_name": "True Mangrove",
                                "iucn_url": "https://www.iucnredlist.org/search?query=Rhizophora%20mucronata&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 55,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Rhizophora stylosa",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Rhizophora%20stylosa&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 56,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Scyphiphora hydrophylacea",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Scyphiphora%20hydrophylacea&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 57,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Sonneratia alba",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Sonneratia%20alba&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 59,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Sonneratia caseolaris",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Sonneratia%20caseolaris&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 61,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Sonneratia lanceolata",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Sonneratia%20lanceolata&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 64,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Xylocarpus granatum",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Xylocarpus%20granatum&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 65,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Xylocarpus moluccensis",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Xylocarpus%20moluccensis&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 12,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Avicennia alba",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20alba&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 17,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Avicennia officinalis",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20officinalis&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 40,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Kandelia candel",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Kandelia%20candel&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 58,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Sonneratia apetala",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Sonneratia%20apetala&searchType=species",
                                "red_list_cat": "lc"
                            },
                            {
                                "id": 41,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Kandelia obovata",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Kandelia%20obovata&searchType=species",
                                "red_list_cat": "lc"
                            }
                        ]
                    },
                    "stroke": "#61C55A",
                    "fill": "#61C55A",
                    "value": 70.3125,
                    "color": "#61C55A",
                    "percentage": 70.3125,
                    "label": "LC - Least Concern",
                    "species": [
                        {
                            "id": 6,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Acrostichum speciosum",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Acrostichum%20speciosum&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 22,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Bruguiera gymnorhiza",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Bruguiera%20gymnorhiza&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 49,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Pemphis acidula",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Pemphis%20acidula&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 4,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Acrostichum aureum",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Acrostichum%20aureum&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 5,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Acrostichum danaeifolium",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Acrostichum%20danaeifolium&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 14,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Avicennia germinans",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20germinans&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 31,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Conocarpus erectus",
                            "common_name": "Silver-leaved Buttonwood",
                            "iucn_url": "https://www.iucnredlist.org/search?query=Conocarpus%20erectus&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 42,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Laguncularia racemosa",
                            "common_name": "White Mangrove",
                            "iucn_url": "https://www.iucnredlist.org/search?query=Laguncularia%20racemosa&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 51,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Rhizophora mangle",
                            "common_name": "Red Mangrove",
                            "iucn_url": "https://www.iucnredlist.org/search?query=Rhizophora%20mangle&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 53,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Rhizophora racemosa",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Rhizophora%20racemosa&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 19,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Avicennia schaueriana",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20schaueriana&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 2,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Acanthus ebracteatus",
                            "common_name": "Holy Mangrove",
                            "iucn_url": "https://www.iucnredlist.org/search?query=Acanthus%20ebracteatus&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 3,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Acanthus ilicifolius",
                            "common_name": "Holy Mangrove",
                            "iucn_url": "https://www.iucnredlist.org/search?query=Acanthus%20ilicifolius&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 7,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Aegialitis annulata",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Aegialitis%20annulata&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 9,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Aegiceras corniculatum",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Aegiceras%20corniculatum&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 16,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Avicennia marina",
                            "common_name": "Grey Mangrove",
                            "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20marina&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 20,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Bruguiera cylindrica",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Bruguiera%20cylindrica&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 21,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Bruguiera exaristata",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Bruguiera%20exaristata&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 24,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Bruguiera parviflora",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Bruguiera%20parviflora&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 25,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Bruguiera sexangula",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Bruguiera%20sexangula&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 27,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Camptostemon schultzii",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Camptostemon%20schultzii&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 28,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Ceriops australis",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Ceriops%20australis&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 30,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Ceriops tagal",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Ceriops%20tagal&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 32,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Cynometra iripa",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Cynometra%20iripa&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 34,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Dolichandrone spathacea",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Dolichandrone%20spathacea&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 35,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Excoecaria agallocha",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Excoecaria%20agallocha&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 39,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Heritiera littoralis",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Heritiera%20littoralis&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 43,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Lumnitzera littorea",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Lumnitzera%20littorea&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 44,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Lumnitzera racemosa",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Lumnitzera%20racemosa&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 46,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Nypa fruticans",
                            "common_name": "Nypa Palm",
                            "iucn_url": "https://www.iucnredlist.org/search?query=Nypa%20fruticans&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 47,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Osbornia octodonta",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Osbornia%20octodonta&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 50,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Rhizophora apiculata",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Rhizophora%20apiculata&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 52,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Rhizophora mucronata",
                            "common_name": "True Mangrove",
                            "iucn_url": "https://www.iucnredlist.org/search?query=Rhizophora%20mucronata&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 55,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Rhizophora stylosa",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Rhizophora%20stylosa&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 56,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Scyphiphora hydrophylacea",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Scyphiphora%20hydrophylacea&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 57,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Sonneratia alba",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Sonneratia%20alba&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 59,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Sonneratia caseolaris",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Sonneratia%20caseolaris&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 61,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Sonneratia lanceolata",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Sonneratia%20lanceolata&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 64,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Xylocarpus granatum",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Xylocarpus%20granatum&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 65,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Xylocarpus moluccensis",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Xylocarpus%20moluccensis&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 12,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Avicennia alba",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20alba&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 17,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Avicennia officinalis",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Avicennia%20officinalis&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 40,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Kandelia candel",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Kandelia%20candel&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 58,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Sonneratia apetala",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Sonneratia%20apetala&searchType=species",
                            "red_list_cat": "lc"
                        },
                        {
                            "id": 41,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Kandelia obovata",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Kandelia%20obovata&searchType=species",
                            "red_list_cat": "lc"
                        }
                    ],
                    "cx": 357.75625,
                    "cy": 135,
                    "innerRadius": 63.25,
                    "outerRadius": 97.75,
                    "maxRadius": 171.92742116071148,
                    "startAngle": 100.4375,
                    "endAngle": 345.125,
                    "paddingAngle": 2
                }
            }
        ],
        "DD - Data Deficient": [
            {
                "type": "rect",
                "value": "DD - Data Deficient",
                "color": "#D1D1C8",
                "payload": {
                    "percent": 0.03125,
                    "name": "DD - Data Deficient",
                    "tooltipPayload": [
                        {
                            "name": "DD - Data Deficient",
                            "value": 3.125,
                            "payload": {
                                "payload": {
                                    "value": 2,
                                    "color": "#D1D1C8",
                                    "percentage": 3.125,
                                    "label": "DD - Data Deficient",
                                    "species": [
                                        {
                                            "id": 11,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Aglaia cucullata",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Aglaia%20cucullata&searchType=species",
                                            "red_list_cat": "dd"
                                        },
                                        {
                                            "id": 36,
                                            "created_at": "2022-04-20T15:21:43.085Z",
                                            "updated_at": "2022-04-20T15:21:43.085Z",
                                            "scientific_name": "Excoecaria indica",
                                            "common_name": null,
                                            "iucn_url": "https://www.iucnredlist.org/search?query=Excoecaria%20indica&searchType=species",
                                            "red_list_cat": "dd"
                                        }
                                    ]
                                },
                                "stroke": "#D1D1C8",
                                "fill": "#D1D1C8",
                                "value": 2,
                                "color": "#D1D1C8",
                                "percentage": 3.125,
                                "label": "DD - Data Deficient",
                                "species": [
                                    {
                                        "id": 11,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Aglaia cucullata",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Aglaia%20cucullata&searchType=species",
                                        "red_list_cat": "dd"
                                    },
                                    {
                                        "id": 36,
                                        "created_at": "2022-04-20T15:21:43.085Z",
                                        "updated_at": "2022-04-20T15:21:43.085Z",
                                        "scientific_name": "Excoecaria indica",
                                        "common_name": null,
                                        "iucn_url": "https://www.iucnredlist.org/search?query=Excoecaria%20indica&searchType=species",
                                        "red_list_cat": "dd"
                                    }
                                ]
                            },
                            "dataKey": "percentage"
                        }
                    ],
                    "midAngle": 352.5625,
                    "middleRadius": 80.5,
                    "tooltipPosition": {
                        "x": 437.5789756041788,
                        "y": 145.42029160436388
                    },
                    "payload": {
                        "payload": {
                            "value": 2,
                            "color": "#D1D1C8",
                            "percentage": 3.125,
                            "label": "DD - Data Deficient",
                            "species": [
                                {
                                    "id": 11,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Aglaia cucullata",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Aglaia%20cucullata&searchType=species",
                                    "red_list_cat": "dd"
                                },
                                {
                                    "id": 36,
                                    "created_at": "2022-04-20T15:21:43.085Z",
                                    "updated_at": "2022-04-20T15:21:43.085Z",
                                    "scientific_name": "Excoecaria indica",
                                    "common_name": null,
                                    "iucn_url": "https://www.iucnredlist.org/search?query=Excoecaria%20indica&searchType=species",
                                    "red_list_cat": "dd"
                                }
                            ]
                        },
                        "stroke": "#D1D1C8",
                        "fill": "#D1D1C8",
                        "value": 2,
                        "color": "#D1D1C8",
                        "percentage": 3.125,
                        "label": "DD - Data Deficient",
                        "species": [
                            {
                                "id": 11,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Aglaia cucullata",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Aglaia%20cucullata&searchType=species",
                                "red_list_cat": "dd"
                            },
                            {
                                "id": 36,
                                "created_at": "2022-04-20T15:21:43.085Z",
                                "updated_at": "2022-04-20T15:21:43.085Z",
                                "scientific_name": "Excoecaria indica",
                                "common_name": null,
                                "iucn_url": "https://www.iucnredlist.org/search?query=Excoecaria%20indica&searchType=species",
                                "red_list_cat": "dd"
                            }
                        ]
                    },
                    "stroke": "#D1D1C8",
                    "fill": "#D1D1C8",
                    "value": 3.125,
                    "color": "#D1D1C8",
                    "percentage": 3.125,
                    "label": "DD - Data Deficient",
                    "species": [
                        {
                            "id": 11,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Aglaia cucullata",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Aglaia%20cucullata&searchType=species",
                            "red_list_cat": "dd"
                        },
                        {
                            "id": 36,
                            "created_at": "2022-04-20T15:21:43.085Z",
                            "updated_at": "2022-04-20T15:21:43.085Z",
                            "scientific_name": "Excoecaria indica",
                            "common_name": null,
                            "iucn_url": "https://www.iucnredlist.org/search?query=Excoecaria%20indica&searchType=species",
                            "red_list_cat": "dd"
                        }
                    ],
                    "cx": 357.75625,
                    "cy": 135,
                    "innerRadius": 63.25,
                    "outerRadius": 97.75,
                    "maxRadius": 171.92742116071148,
                    "startAngle": 347.125,
                    "endAngle": 358,
                    "paddingAngle": 2
                }
            }
        ]
    }} />}
      {...props}
    />
  );
}

MangroveSpecies.propTypes = {
  data: PropTypes.shape({}),
  currentLocation: PropTypes.shape({}),
  addFilter: PropTypes.func,
  isCollapsed: PropTypes.bool,
  slug: PropTypes.string,
  name: PropTypes.string,
  metadata: PropTypes.shape({}),
};

MangroveSpecies.defaultProps = {
  data: null,
  currentLocation: null,
  addFilter: () => {},
  isCollapsed: false,
  slug: null,
  name: null,
  metadata: null,
};

export default MangroveSpecies;
