import { createSelector } from "reselect";
import { currentDashboard } from "modules/dashboards/selectors";
import { currentLocation } from "modules/locations/selectors";
import { flatten, isEmpty } from "lodash";

const widgets = (state) => state.widgets.list;
const locations = (state) => state.locations.list;
const widgetsData = (state) => [
  { mangrove_extent: state.mangroveHabitatExtentData.data },
  { mangrove_net_change: state.mangroveNetChangeData.data },
  { mangrove_activity: state.ranking.data },
  { mangrove_alerts: state.alerts.data },
  { mangrove_species: state.mangroveSpeciesData.data },
  { mangrove_protection: state.mangroveProtectionData.data },
  { mangrove_restoration: state.mangroveRestorationData.data },
  { mangrove_biomass: state.mangroveBiomassData.data },
  { mangrove_height: state.mangroveHeightData.data },
  { mangrove_blue_carbon: state.mangroveBlueCarbonData.data },
  {
    mangrove_emissions_mitigation: state.mangroveEmissionsMitigationData.data,
  },
  {
    mangrove_international_status: state.mangroveInternationalStatusData.data,
  },
  {
    mangrove_investment_potential: state.mangroveInvestmentPotentialData.data,
  },
];
const drawingMode = (state) => state.drawingTool.drawingMode;
const drawingValue = (state) => state.drawingTool.drawingValue;
const currentCategory = (state) => state.dashboards.current;

export const dashboardWidgets = createSelector(
  [widgets, currentDashboard, currentLocation, widgetsData, drawingMode],
  (
    _widgets,
    _currentDashboard,
    _currentLocation,
    _widgetsData,
    _drawingMode
  ) => {
    const location_type = _currentLocation?.location_type;

    return _drawingMode
      ? _widgets.filter(
          ({ locationType, slug }) =>
            slug === "mangrove_extent" ||
            slug === "mangrove_net_change" ||
            slug === "mangrove_biomass" ||
            slug === "mangrove_height" ||
            slug === "mangrove_blue_carbon" ||
            (slug === "mangrove_alerts" && locationType.includes(location_type))
        )
      : _widgets.filter(
          ({ categoryIds, locationType }) =>
            categoryIds.includes(_currentDashboard) &&
            (locationType.includes(location_type) ||
              locationType.includes("worlwide"))
        );
  }
);

export const categoryWidgets = createSelector(
  [widgets, widgetsData, currentCategory],
  (
    _widgets,
    _widgetsData,
    _currentCategory,
  ) => {
    return _widgets.filter(({ categoryIds }) => categoryIds.includes(_currentCategory)).map((w) => w.slug);
  }
);

export const getWidgetsWithData = createSelector(
  [widgetsData],
  (_widgetsData) =>
    flatten(
      _widgetsData?.reduce((acc, w) => {
        if (!!Object.values(w)[0].length) {
          return [...acc, Object.keys(w)];
        } else if (!isEmpty(Object.values(w)[0])) {
          return [...acc, Object.keys(w)];
        } else {
          return [...acc];
        }
      }, [])
    )
);

export const isActiveCustomArea = createSelector(
  [drawingValue],
  (_drawingValue) => !!_drawingValue.length
);

export const activeWidgets = createSelector([widgets], (_widgets) =>  _widgets.filter((widget) => widget.isActive)
);

export const activeLayers = createSelector(
  [activeWidgets],
  (_activeWidgets) => _activeWidgets.length
);

export const conservationHotspots = createSelector(
  [locations],
  (_locations) => {
    const location_ids = [
      process.env.RUFIKI_MAFIA_KILWA_LOCATION_ID,
      process.env.MAFIA_ISLAND_LOCATION_ID,
    ];
    const widgetData = _locations.filter((location) =>
      location_ids.includes(location.location_id)
    );

    return { widgetData };
  }
);

export const coverageWidget = createSelector(
  [currentLocation],
  (_currentLocation) => {
    const years = Object.keys(_currentLocation.length_mangrove_m);
    const total = _currentLocation.length_coast_m;

    const widgetData = years.map((year) => ({
      x: Number(year),
      y: 100,
      color: "#00857F",
      percentage: (_currentLocation.length_mangrove_m[year] / total) * 100,
      unit: "%",
      value: _currentLocation.length_mangrove_m[year],
      label: `Coastline coverage in ${year}`,
    }));

    return {
      metadata: { total, years },
      widgetData,
    };
  }
);

export const netChangeWidget = createSelector(
  [currentLocation],
  (_currentLocation) => {
    if (
      _currentLocation.mangrove_loss_m2 &&
      _currentLocation.mangrove_loss_m2
    ) {
      const gain = _currentLocation.mangrove_gain_m2;
      const loss = _currentLocation.mangrove_loss_m2;
      const years = Object.keys(loss);
      const totalLoss = years.reduce(
        (year, nextYear) =>
          parseFloat(loss[year] || 0) + parseFloat(loss[nextYear] || 0)
      );

      const widgetData = years.map((year) => ({
        Gain: parseFloat(gain[year]),
        Loss: -parseFloat(loss[year]),
        "Net change": parseFloat(gain[year]) - parseFloat(loss[year]),
        year,
      }));

      return {
        metadata: { totalLoss, years },
        widgetData,
      };
    }

    return { metadata: { years: [] }, widgetData: [] };
  }
);
