import React, { useEffect, useMemo, useCallback, useState } from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";

import { useWidget } from 'hooks/widgets'

import ChartWidget from "components/chart-widget";
import Select from "components/select";
import WidgetDrawingToolControls from "widget-components/mangrove-drawing-tool/widget-drawing-tool-controls";

import config, { numberFormat } from "./config";

const unitOptions = [
  { value: "km²", label: "km²" },
  { value: "ha", label: "ha" },
];

function MangroveNetChange({
  filename,
  locations,
  addFilter,
  isCollapsed = true,
  slug,
  name,
  ui,
  setUi,
  currentLocation,
  drawingValue,
  drawingMode,
  customGeojsonFeatures,
  ...props
}) {
  const [restart, setRestart] = useState(null);
  const { startYear: startYearUi, endYear: endYearUi, unit: unitUi } = ui;

  const params = (currentLocation?.id === "custom-area" || drawingMode) ? {
    drawingValue,
    slug: ["mangrove_net_change"],
    location_id: "custom-area",
  } : {
    ...(currentLocation?.iso.toLowerCase() !== "worldwide" && {
      location_id: currentLocation.id,
    }),
  };

  const { data, metadata, isFetching } = useWidget({ params, wId: 'net_change' });
  const { year } = metadata || {};

  const years = year?.sort() || [];

  const startYear = useMemo(
    () => (startYearUi && years.includes(startYearUi) ? startYearUi : years[0]),
    [startYearUi, years]
  );

  const endYear = useMemo(
    () => endYearUi || years?.[years?.length - 1],
    [endYearUi, years]
  );

  const unit = useMemo(() => unitUi || unitOptions[0].value, [unitUi]);
  const customArea = useMemo(() => !!drawingValue?.length || !isEmpty(customGeojsonFeatures), [drawingValue, customGeojsonFeatures]);


  const filteredYears = useMemo(
    () =>
      years.filter(
        (year) => !!years.length && year >= startYear && year <= endYear
      ),
    [years, startYear, endYear]
  );

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
  }, [
    startYear,
    endYear,
    unit,
    addFilter,
    setUi,
    years,
    data,
    data.length,
    filteredYears,
  ]);

  const dataFilteredByYears = data.filter(
    ({ year }) => year >= startYear && year <= endYear
  );

  const widgetData = config.parse(dataFilteredByYears, unit, drawingMode);
  const { change, chartData, chartConfig } = widgetData;

  const yearsOptions = years.map((y) => ({
    label: y.toString(),
    value: y,
  }));

  const changeYear = useCallback(
    (key, value) => {
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
    },
    [setUi, addFilter, endYear, startYear, ui, years]
  );

  const widgetDataFiltered = chartData.filter(
    ({ year: y }) =>
      parseInt(y, 10) >= parseInt(startYear, 10) &&
      parseInt(y, 10) <= parseInt(endYear, 10)
  );

  // How this change is calculated?
  // Rows have year's 'gain', 'loss' and 'netChange'.
  // We consider startYear as 0
  // Therefore we substract that from the accumulated change of all following years.

  const quantity = numberFormat(Math.abs(change));

  // Normalize startData
  widgetDataFiltered[0] = {
    ...widgetDataFiltered[0],
    netChange: 0,
  };

  const location = useMemo(() => {
    if (customArea) return "the area selected";
    if (currentLocation.location_type === "worldwide") return "the world";
    else return currentLocation?.name;
  }, [currentLocation, customArea]);

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
      ),
    [yearsOptions, years.length]
  );
  const endYearOptions = useMemo(
    () => yearsOptions?.filter((y, index) => (index !== 0 ? y : null)),
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
        option.value === startYear ||
        endYear === option.value
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
        option.value === endYear ||
        startYear === option.value
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

  const loadingAnalysis = useMemo(
    () => (isFetching && drawingMode) || restart,
    [isFetching, drawingMode, restart]
  );

  if (!data || !data.length) {
    return null;
  }

  return (
    <ChartWidget
      name={name}
      data={data}
      slug={slug}
      filename={slug}
      isCollapsed={loadingAnalysis ? false : isCollapsed}
      sentence={loadingAnalysis ? null : sentence}
      isLoading={isFetching}
      chartData={chartRData}
      chart={!loadingAnalysis}
      {...props}
      component={drawingMode && (
        <WidgetDrawingToolControls
          slug="mangrove_net_change"
          fetch={useWidget}
          drawingValue={drawingValue}
          isLoading={isFetching}
          restart={restart}
          setRestart={setRestart}
          wId='net_change'
        />
      )}
    />
  );
}

MangroveNetChange.propTypes = {
  name: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.shape({})),
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
