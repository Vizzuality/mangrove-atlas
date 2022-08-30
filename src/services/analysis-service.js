import axios from "axios";

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
  }

  fetchMangroveCustomAreaAnalysisData = ({
    geojson,
    widgets,
    location_id,
  }) => {
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
        params: { widgets }
      })
      .then((response) => {
        const { status, statusText, data } = response;
        if (status >= 400) throw new Error(statusText);
        return location_id !== "custom-area"
          ? data
          : data[WIDGETS_DICTIONARY[widgets[0]]];
      });
  }

}

export default new AnalysisService();
