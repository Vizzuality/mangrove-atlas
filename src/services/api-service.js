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

  fetchMangroveHabitatExtentData = (params = {}) =>
    this.client
      .get("/v2/widgets/habitat_extent", { params: { ...params } })
      .then((response) => {
        const { status, statusText, data } = response;
        if (status >= 400) throw new Error(statusText);
        return data;
      });

  fetchMangroveNetChangeData = (params = {}) =>
    this.client
      .get("/v2/widgets/net_change", { params: { ...params } })
      .then((response) => {
        const { status, statusText, data } = response;
        if (status >= 400) throw new Error(statusText);
        return data;
      });

  fetchMangroveBlueCarbonData = (params = {}) =>
    this.client
      .get("/v2/widgets/blue_carbon", { params: { ...params } })
      .then((response) => {
        const { status, statusText, data } = response;
        if (status >= 400) throw new Error(statusText);
        return data;
      });

  fetchMangroveBiomassData = (params = {}) =>
    this.client
      .get("/v2/widgets/aboveground_biomass", { params: { ...params } })
      .then((response) => {
        const { status, statusText, data } = response;
        if (status >= 400) throw new Error(statusText);
        return data;
      });

  fetchMangroveHeightData = (params = {}) =>
    this.client
      .get("/v2/widgets/tree_height", { params: { ...params } })
      .then((response) => {
        const { status, statusText, data } = response;
        if (status >= 400) throw new Error(statusText);
        return data;
      });

  fetchRankingData = (params = {}) => {
    return this.client
      .get(
        "/v2/widgets/country_ranking", { params: { ...params } })
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
      .get("/v2/widgets/mitigation_potentials", { params: { ...params } })
      .then((response) => {
        const { status, statusText, data } = response;
        if (status >= 400) throw new Error(statusText);
        return data;
      });
}

export default APIService;
