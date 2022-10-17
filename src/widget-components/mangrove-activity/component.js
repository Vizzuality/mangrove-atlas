import React, { useCallback, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import orderBy from "lodash/orderBy";

import ChartWidget from "components/chart-widget";
import Select from "components/select";

import moreIcon from "../icons/icon-more.svg";
import lessIcon from "../icons/icon-less.svg";

import config from "./config";

function MangroveActivity({
  isLoading,
  data: rawData,
  metadata,
  fetchRankingData,
  isCollapsed = true,
  slug,
  name,
  ui,
  setUi,
  ...props
}) {
  const { start_year, end_year, limit = 5, filter = "net" } = ui;

  const years = useMemo(() => metadata?.years, [metadata]);
  const startYear = useMemo(() => metadata?.start_year, [metadata]);
  const endYear = useMemo(() => metadata?.end_year, [metadata]);

  const startDate = useMemo(
    () => start_year || Number(startYear),
    [start_year, startYear]
  );
  const endDate = useMemo(
    () => end_year || Number(endYear),
    [end_year, endYear]
  );

  useEffect(() => {
    fetchRankingData({
      ...(startDate && { start_year: startDate }),
      ...(endDate && { end_year: endDate }),
      limit,
    });
  }, [fetchRankingData, start_year, end_year, startDate, endDate, limit]);

  useEffect(() => {
    if (!isLoading) {
      setUi({
        id: "activity",
        value: {
          start_year: startDate,
          end_year: endDate,
          limit,
        },
      });
    }
  }, [start_year, end_year, startDate, endDate, isLoading, limit, setUi]);

  const changeYear = useCallback(
    (type, value) => {
      setUi({
        id: "activity",
        value: {
          ...ui,
          [type]: value,
        },
      });
    },
    [setUi, ui]
  );

  // temporary hidden as there is no data to filter
  // const changeFilter = (filterState) => {
  //   setUi({
  //     id: 'activity',
  //     value: {
  //       ...ui,
  //       filter: filterState,
  //     }
  //   });
  //   fetchRankingData({
  //     ...ui,
  //     filter: filterState
  //   });
  // };

  const changeLimit = useCallback(
    (limitState) => {
      setUi({
        id: "activity",
        value: {
          ...ui,
          limit: limitState,
        },
      });
    },
    [setUi, ui]
  );

  const startYearOptions = useMemo(
    () =>
      years?.map((year) => ({
        label: year,
        value: year,
      })),
    [years]
  );

  const endYearOptions = useMemo(
    () =>
      years?.map((year) => ({
        label: year,
        value: year,
      })),
    [years]
  );

  if (!rawData.length || !metadata) {
    return null;
  }

  const { chartData, chartConfig } = config.parse(rawData, filter, limit);

  const sortRanking = (data) =>
    orderBy(data, filter, (d) => Math.abs(d`${filter}`)).map((f, index) => ({
      ...f,
      x: index,
    }));

  //temporary hidden as data needs to be uploaded
  // const optionsFilter = [
  //   { value: 'gain', label: 'gain' },
  //   { value: 'loss', label: 'loss' },
  //   { value: 'net_change', label: 'net increase' },
  // ];

  // temporary hidden as there is no data
  // Selectors
  // const filterSelector = (
  //   <Select
  //     value={filter}
  //     options={optionsFilter}
  //     classNamePrefix="react-select"
  //     onChange={value => changeFilter(value)}
  //   />
  // );

  const startYearSelector = (
    <Select
      value={startDate}
      options={startYearOptions}
      isOptionDisabled={(option) =>
        parseInt(option.value, 10) > parseInt(endDate, 10) ||
        option.value === startDate || option.value === endDate
      }
      onChange={(value) => changeYear("start_year", value)}
    />
  );

  const endYearSelector = (
    <Select
      value={endDate}
      options={endYearOptions}
      isOptionDisabled={(option) =>
        parseInt(option.value, 10) < parseInt(startDate, 10) ||
        option.value === endDate || option.value === startDate
      }
      onChange={(value) => changeYear("end_year", value)}
    />
  );

  const customStyles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    fontSize: "14px",
    color: "#00857F",
    fontWeight: 600,
  };

  const sentence = (
    <>
      Worldwide the {limit} countries with the largest net change
      {/* {filterSelector} TO - DO put back selector when API returns gain and loss values */}
      &nbsp;in Mangrove habitat extent between {startYearSelector} and{" "}
      {endYearSelector} were:
    </>
  );
  const countriesLimit = (
    <>
      <button
        style={customStyles}
        type="button"
        onClick={(value) =>
          changeLimit(limit === 5 ? limit + 5 : limit - 5, value)
        }
      >
        {limit === 5 ? "Show 10" : "Show 5"}
        <img
          alt={limit === 5 ? "Show more results" : "Show less results"}
          src={limit === 5 ? moreIcon : lessIcon}
        />
      </button>
    </>
  );

  const sortedData = sortRanking(chartData);

  const chartRData = {
    data: sortedData,
    config: chartConfig,
  };

  return (
    <ChartWidget
      name={name}
      data={sortedData}
      slug={slug}
      filename={slug}
      isCollapsed={isCollapsed}
      sentence={sentence}
      chartData={chartRData}
      component={countriesLimit}
      {...props}
    />
  );
}

MangroveActivity.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  fetchRankingData: PropTypes.func.isRequired,
};

export default MangroveActivity;
