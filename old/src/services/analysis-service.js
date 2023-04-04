import axios from "axios";
import FormData from "form-data";

const WIDGETS_DICTIONARY = {
  mangrove_extent: "mangrove_extent",
  mangrove_net_change: "mangrove_net_change",
  mangrove_biomass: "mangrove_biomass",
  mangrove_height: "avg_height",
  mangrove_blue_carbon: "mangrove_blue_carbon",
  mangrove_alerts: "mangrove_alerts",
};

class AnalysisService {
  constructor() {
    this.client = axios.create({
      baseURL: "https://us-central1-mangrove-atlas-246414.cloudfunctions.net",
      headers: { "Content-Type": "application/json" },
    });
    this.widgetControllers = {};

    this.clientAnalysis = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}/api`,
      headers: { "Content-Type": "application/json" },
    });
  }

  fetchMangroveCustomAreaAnalysisData = ({ geojson, widgets, location_id }) => {
    if (this.widgetControllers[widgets.toString()]) {
      this.widgetControllers[widgets.toString()].abort();
    }
    const controller = new AbortController();
    this.widgetControllers[widgets.toString()] = controller;

    return this.client
      .request({
        method: "post",
        url: "/analysis",
        data: {
          geometry: {
            type: "FeatureCollection",
            features: geojson,
          },
        },
        signal: controller.signal,
        params: { widgets },
      })
      .then((response) => {
        const { status, statusText, data } = response;
        if (status >= 400) throw new Error(statusText);
        return location_id !== "custom-area"
          ? data
          : data[WIDGETS_DICTIONARY[widgets[0]]];
      });
  };

  uploadFile = (file) => {
    let data = new FormData();
    data.append('file', file);
    return this.clientAnalysis
      .request({
        method: "post",
        url: "/v2/spatial_file/converter",
        data,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      })
      .then((response) => {
        const { status, statusText, data } = response;
        if (status >= 400) throw new Error(statusText);
        return data;
      })
      .catch(function (error) {
        console.log(error);
      });
  };
}

export default new AnalysisService();
