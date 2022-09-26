import React, { useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";

import ChartWidget from "components/chart-widget";
import Select from "components/select";
import config, { numberFormat } from "./config";

const unitOptions = [
  { value: "km²", label: "km²" },
  { value: "ha", label: "ha" },
];

function MangroveNetChange({
  data,
  isLoading,
  metadata,
  filename,
  locations,
  locationType,
  addFilter,
  isCollapsed = true,
  slug,
  name,
  ui,
  setUi,
  fetchMangroveNetChangeData,
  currentLocation,
  ...props
}) {
  
  const { startYear: startYearUi, endYear: endYearUi, unit: unitUi } = ui;
  const years = metadata?.year.sort() || [];
  const startYear = useMemo(
    () => startYearUi || years[0],
    [startYearUi, years]
  );
  const endYear = useMemo(
    () => endYearUi || years?.[years?.length - 1],
    [endYearUi, years]
  );

  const unit = useMemo(
    () => unitUi || unitOptions[0].value,
    [unitUi]
  );

  useEffect(() => {
    fetchMangroveNetChangeData({
      ...(currentLocation?.iso?.toLowerCase() !== "worldwide" && {
        location_id: currentLocation.id,
      }),
    });
  }, [fetchMangroveNetChangeData, currentLocation]);

  const filteredYears = useMemo(() => years.filter((year) => !!years.length && year >= startYear && year <= endYear), [years, startYear, endYear]);

  useEffect(() => {
    if (data && data.length) {
      addFilter({
        filter: {
          id: "net",
          startYear: startYear,
          endYear: endYear,
          years: filteredYears,
          unit: unit,
        },
      });
      setUi({
        id: "net",
        value: {
          endYear: endYear,
          startYear: startYear,
          years: filteredYears,
          unit: unit,
        },
      });
    }
  }, [startYear, endYear, unit, addFilter, setUi, years, data, data.length, filteredYears]);

  const dataFilteredByYears = data.filter(
    ({ year }) => year >= startYear && year <= endYear
  );

  const widgetData = config.parse(dataFilteredByYears, unit);
  const { change, chartData, chartConfig } = widgetData;

  const yearsOptions = years.map((y) => ({
    label: y.toString(),
    value: y,
  }));

  const changeYear = useCallback((key, value) => {
    addFilter({
      filter: {
        ...ui,
        id: "net",
        [key]: value,
        range: {
          ...ui.range,
          [key]: value,
        },
        years: years.filter((i) => i >= startYear && i <= endYear),
      },
    });
    setUi({
      id: "net",
      ...ui,
      value: {
        ...ui.value,
        [key]: value,
        range: {
          ...ui.range,
          [key]: value,
        },
      },
    });
  }, [setUi, addFilter, endYear, startYear, ui, years]);

  const widgetDataFiltered = chartData.filter(
    ({ year: y }) =>
      parseInt(y, 10) >= parseInt(startYear, 10) &&
      parseInt(y, 10) <= parseInt(endYear, 10)
  );

  // How this change is calculated?
  // Rows have year's 'gain', 'loss' and 'netChange'.
  // We consider startYear as 0
  // Therefore we substract that from the accumulated change of all following years.

  const quantity =
    unit === "km²"
      ? numberFormat(Math.abs(change))
      : numberFormat(Math.abs(change * 100));

  // Normalize startData
  widgetDataFiltered[0] = {
    ...widgetDataFiltered[0],
    netChange: 0,
  };

  const location =
    currentLocation?.location_type === "worldwide" ? (
      "the world"
    ) : (
      <span className="notranslate">{currentLocation?.name}</span>
    );
  const direction = change > 0 ? "increased" : "decreased";

  const changeUnit = (selectedUnit) => {
    addFilter({
      filter: {
        id: "net",
        startYear,
        endYear,
        range: {
          startYear,
          endYear,
        },
        years,
        unit: selectedUnit,
      },
    });
    setUi({
      id: "net",
      value: {
        startYear,
        endYear,
        range: {
          startYear,
          endYear,
        },
        years,
        unit: selectedUnit,
      },
    });
  };

  const startYearOptions = useMemo(
    () =>
      yearsOptions?.filter((y, index) =>
        index !== years.length - 1 ? y : null
      ) || [],
    [yearsOptions, years.length]
  );
  const endYearOptions = useMemo(
    () => yearsOptions?.filter((y, index) => (index !== 0 ? y : null)) || [],
    [yearsOptions]
  );

  const startSelector = (
    <Select
      className="notranslate netChange"
      prefix="start-year"
      value={startYear}
      options={startYearOptions}
      isOptionDisabled={(option) =>
        parseInt(option.value, 10) > parseInt(endYear, 10) ||
        option.value === startYear
      }
      onChange={(v) => changeYear("startYear", v)}
    />
  );
  const endSelector = (
    <Select
      className="notranslate"
      prefix="end-year"
      value={endYear}
      options={endYearOptions}
      isOptionDisabled={(option) =>
        parseInt(option.value, 10) < parseInt(startYear, 10) ||
        option.value === endYear
      }
      onChange={(v) => changeYear("endYear", v)}
    />
  );

  const unitSelector = (
    <Select value={unit} options={unitOptions} onChange={changeUnit} />
  );

  const sentence = (
    <>
      The extent of mangroves in <strong>{location}</strong>&nbsp; has{" "}
      <strong>{direction}</strong> by <strong>{quantity}</strong> {unitSelector}
      &nbsp;between {startSelector} and {endSelector}.
    </>
  );

  const chartRData = {
    data: chartData,
    config: chartConfig,
  };

  if (!data || !data.length) {
    return null;
  }
  return (
    <ChartWidget
      name={name}
      data={data}
      slug={slug}
      filename={slug}
      isCollapsed={isCollapsed}
      sentence={sentence}
      chartData={chartRData}
      {...props}
    />
  );
}

MangroveNetChange.propTypes = {
  name: PropTypes.string,
  data: PropTypes.shape({}),
  slug: PropTypes.string,
  filename: PropTypes.string,
  currentLocation: PropTypes.shape({}),
  addFilter: PropTypes.func,
};

MangroveNetChange.defaultProps = {
  name: null,
  data: null,
  slug: null,
  filename: null,
  currentLocation: null,
  addFilter: null,
};

export default MangroveNetChange;