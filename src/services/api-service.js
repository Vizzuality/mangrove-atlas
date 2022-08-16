import axios from "axios";

class APIService {
  constructor() {
    this.client = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}/api`,
      headers: { "Content-Type": "application/json" },
    });
  }

  fetchLocations = (params = {}) =>
    this.client.get("/v2/locations", { params }).then((response) => {
      const { status, statusText, data } = response;
      if (status >= 400) throw new Error(statusText);
      return data;
    });

  fetchMangroveData = (params = {}) => {
    const { id, iso } = params;
    const locationParam = id || iso || "worldwide";

    return this.client
      .get(`/v1/locations/${locationParam}/mangrove_data`)
      .then((response) => {
        const { status, statusText, data } = response;
        if (status >= 400) throw new Error(statusText);
        return data;
      });
  };

  fetchMangroveHabitatExtentData = (params = {}) =>
    this.client
      .get("/v2/widgets/habitat_extent", { params: { ...params } })
      .then((response) => {
        const { status, statusText, data } = response;
        if (status >= 400) throw new Error(statusText);
        return data;
      }
    );

  fetchMangroveNetChangeData = (params = {}) =>
    this.client
      .get("/v2/widgets/net_change", { params: { ...params } })
      .then((response) => {
        const { status, statusText, data } = response;
        if (status >= 400) throw new Error(statusText);
        return data;
      }
    );

  fetchMangroveBiomassData = (params = {}) =>
    this.client
      .get("/v2/widgets/aboveground_biomass", { params: { ...params } })
      .then((response) => {
        const { status, statusText, data } = response;
        if (status >= 400) throw new Error(statusText);
        return data;
      }
    );

  fetchMangroveHeightData = (params = {}) =>
    this.client
      .get("/v2/widgets/tree_height", { params: { ...params } })
      .then((response) => {
        const { status, statusText, data } = response;
        if (status >= 400) throw new Error(statusText);
        return data;
      }
    );

  fetchRankingData = (params = {}) => {
    const {
      filter = "gain",
      startDate = "2007",
      endDate = "2016",
      limit = 5,
    } = params;
    return this.client
      .get(
        `/v1/locations?rank_by=${filter}_m2&start_date=${startDate}&end_date=${endDate}&location_type=country&limit=${limit}&dir=desc`
      )
      .then((response) => {
        const { status, statusText, data } = response;
        if (status >= 400) throw new Error(statusText);
        return data;
      });
  };

  fetchMangroveSpeciesData = (params = {}) =>
    this.client
      .get("/v2/widgets/biodiversity", { params: { ...params } })
      .then((response) => {
        const { status, statusText, data } = response;
        if (status >= 400) throw new Error(statusText);
        return data;
      });

  fetchMangroveProtectionData = (params = {}) =>
    this.client
      .get("/v2/widgets/protected-areas", { params: { ...params } })
      .then((response) => {
        const { status, statusText, data } = response;
        if (status >= 400) throw new Error(statusText);
        return data;
      });

  fetchInvestmentPotentialData = async (params = {}) => {
    const response = await this.client.get(
      "/v2/widgets/blue-carbon-investment",
      { params: { ...params } }
    );
    const { status, statusText, data } = response;
    if (status >= 400) throw new Error(statusText);
    return data;
  };

  fetchMangroveRestorationData = (params = {}) =>
    this.client
      .get("/v2/widgets/restoration-potential", {
        params: { dir: "desc", ...params },
      })
      .then((response) => {
        const { status, statusText, data } = response;
        if (status >= 400) throw new Error(statusText);
        return data;
      });

  fetchMangroveEcosystemServicesData = (params = {}) =>
    this.client
      .get("/v2/widgets/ecosystem_services", {
        params: { dir: "desc", ...params },
      })
      .then((response) => {
        const { status, statusText, data } = response;
        if (status >= 400) throw new Error(statusText);
        return data;
      });

  fetchMangroveDegradationAndLossData = (params = {}) =>
    this.client
      .get("/v2/widgets/degradation-and-loss", { params: { ...params } })
      .then((response) => {
        const { status, statusText, data } = response;
        if (status >= 400) throw new Error(statusText);
        return data;
      });

  fetchMangroveInternationalStatusData = (params = {}) =>
    this.client
      .get("/v2/widgets/international_status", { params: { ...params } })
      .then((response) => {
        const { status, statusText, data } = response;
        if (status >= 400) throw new Error(statusText);
        return data;
      });

  fetchMangroveEmissionsMitigationData = (params = {}) =>
    this.client
      .get("/v2/widgets/international_status", { params: { ...params } })
      // .get('/widgets/emissions_mitigation', { params: { ...params } })
      .then((response) => {
        const { status, statusText, data } = response;
        // if (status >= 400) throw new Error(statusText);
        return {
          data: [
            {
              indicator: "Grassland and savanna fire mgmt",
              category: "Mangrove",
              value: 5,
              year: 2020,
            },
            {
              indicator: "Reforestation (Tropics)",
              category: "Mangrove",
              value: 232,
              year: 2020,
            },
            {
              indicator: "Mangrove Restoration",
              category: "Other",
              value: 730,
              year: 2020,
            },
            {
              indicator: "Reduce mangrove loss",
              category: "Other",
              value: 2205,
              year: 2020,
            },
          ],
          metatada: {},
        };
      });
}

export default APIService;
