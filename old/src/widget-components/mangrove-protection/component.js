import React, { useEffect, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import sortBy from "lodash/sortBy";

import ChartWidget from "components/chart-widget";
import Select from "components/select";

import config from "./config";

const unitOptions = [
  { value: "ha", label: "ha" },
  { value: "km", label: "km²" },
];

const note =
  "This represents the proportion of mangroves known to occur within protected areas. The level and the effectiveness of protection of these mangroves however are unknown.";

function MangroveProtection({
  data,
  metadata,
  currentLocation,
  isLoading,
  locations,
  isCollapsed = true,
  slug,
  name,
  addFilter,
  ui,
  setUi,
  fetchMangroveProtectionData,
  ...props
}) {
  const years = metadata?.year.sort() || [];
  const { year, unit } = ui;

  useEffect(() => {
    fetchMangroveProtectionData({
      ...(currentLocation?.iso?.toLowerCase() !== "worldwide" && {
        location_id: currentLocation.id,
      }),
    });
  }, [currentLocation, fetchMangroveProtectionData]);

  const unitMetadata = metadata?.units;

  const yearUpdate = useMemo(() => year || years?.[years?.length - 1], [year, years]);
  const unitArea = unitMetadata?.total_area;

  useEffect(() => {
    if (yearUpdate) {
      addFilter({
        filter: {
          id: "protection",
          year: yearUpdate,
          unit: unit || unitArea,
        },
      });
      setUi({
        id: "protection",
        value: { year: yearUpdate, unit: unit || unitArea },
      });
    }
  }, [year, years.length, addFilter, setUi, unit, unitArea, years, yearUpdate]);

  const changeYear = useCallback(
    (current) => {
      addFilter({
        filter: {
          ...ui,
          id: "protection",
          year: current.value,
        },
      });
      setUi({ id: "protection", value: { year: current, ...ui.value } });
    },
    [addFilter, setUi, ui]
  );

  const filteredData = useMemo(() => {
    if (data && year) {
      return data?.find((d) => d.year === year);
    }
  }, [data, year]);

  if (!data || !data?.length) {
    return null;
  }

  const parsedData = {
    ...filteredData,
    total_area: filteredData?.total_area,
    protected_area: filteredData?.protected_area,
  };

  const { chartData, chartConfig, totalAreaProtected, totalArea } =
    config.parse(parsedData, unit);

  if (!chartData) {
    return null;
  }

  const optionsYears = sortBy(
    years.map((year) => ({
      label: year.toString(),
      value: year,
    })),
    ["value"]
  );

  const location =
    currentLocation?.location_type === "worldwide" ? (
      "the world"
    ) : (
      <span className="notranslate">{`${currentLocation.name}`}</span>
    );

  const currentYear = optionsYears?.find((y) => y.value === year)?.value;
  const displayYear =
    optionsYears?.length > 1 ? (
      <Select
        className="notranslate"
        width="auto"
        value={currentYear}
        options={optionsYears}
        onChange={changeYear}
      />
    ) : (
      optionsYears[0].label
    );

  const changeUnit = (selectedUnit) => {
    addFilter({
      filter: {
        id: "protection",
        ...ui,
        unit: selectedUnit,
      },
    });
    setUi({
      id: "protection",
      value: {
        ...ui.value,
        unit: selectedUnit,
      },
    });
  };

  const unitSelector = (
    <Select value={unit} options={unitOptions} onChange={changeUnit} />
  );

  const sentence = (
    <>
      Mangroves found in protected areas in
      <strong>&nbsp;{location}&nbsp;</strong>
      in<strong> {displayYear}</strong> represented{" "}
      <strong>
        {totalAreaProtected} {unitSelector}
      </strong>{" "}
      out of a total{" "}
      <strong>
        {totalArea} {unitSelector}
      </strong>
      .
    </>
  );

  const widgetData = {
    data: chartData,
    config: chartConfig,
  };

  return (
    <ChartWidget
      name={name}
      data={chartData}
      slug={slug}
      filename={slug}
      isCollapsed={isCollapsed}
      sentence={sentence}
      chartData={widgetData}
      note={note}
      {...props}
    />
  );
}

MangroveProtection.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})),
  currentLocation: PropTypes.shape({}),
  addFilter: PropTypes.func,
  isCollapsed: PropTypes.bool,
  slug: PropTypes.string,
  name: PropTypes.string,
  metadata: PropTypes.shape({}),
  ui: PropTypes.shape({
    year: PropTypes.number,
    unit: PropTypes.string,
  }),
  setUi: PropTypes.func,
};

MangroveProtection.defaultProps = {
  data: null,
  currentLocation: null,
  addFilter: () => {},
  isCollapsed: false,
  slug: null,
  name: null,
  metadata: null,
  ui: null,
  setUi: () => {},
};

export default MangroveProtection;
