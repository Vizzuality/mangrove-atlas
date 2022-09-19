import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";

import Select from 'components/select';
import ChartWidget from "components/chart-widget";

import config from "./config";

const labelOptions = [
  {
    label: "at $5/ton",
    value: 5,
  },
  {
    label: "at $10/ton",
    value: 10,
  },
];

function MangroveInvestmentPotential({
  data,
  currentLocation,
  isCollapsed = true,
  slug,
  name,
  fetchInvestmentPotentialData,
  ...props
}) {

  const [investibleBlueCarbon, setInvestibleBlueCarbon] = useState(labelOptions[0].value);
  useEffect(() => {
    fetchInvestmentPotentialData({
      ...(currentLocation?.iso?.toLowerCase() !== "worldwide" && {
        location_id: currentLocation.id,
      }),
    });
  }, [currentLocation, fetchInvestmentPotentialData]);

  const labelHandler = useCallback((value) => {
    setInvestibleBlueCarbon(value);
  }, [setInvestibleBlueCarbon]);

  if (!data || Object.entries(data).length === 0) {
    return null;
  }

  const {
    chartData,
    chartConfig,
    investibleBlueCarbonValue,
  } = config.parse(data, investibleBlueCarbon);


  const labelSelector = (
    <Select
      value={investibleBlueCarbon}
      options={labelOptions}
      onChange={labelHandler}
    />
  );

  if (!chartData || chartData.length <= 0) {
    return null;
  }
  const locationName =
    currentLocation.location_type === "worldwide" ? (
      "the world"
    ) : (
      <span className="notranslate">{`${currentLocation?.name}'s`}</span>
    );

  const sentence = (
    <>
      The extent of investible blue carbon (ha){" "}
      <strong>{labelSelector}</strong> in <strong>{locationName}</strong> is{" "}
      <strong>{investibleBlueCarbonValue?.description}</strong>
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
      {...props}
    />
  );
}

MangroveInvestmentPotential.propTypes = {
  data: PropTypes.shape({}),
  currentLocation: PropTypes.shape({}),
  isCollapsed: PropTypes.bool,
  slug: PropTypes.string,
  name: PropTypes.string,
  metadata: PropTypes.shape({}),
};

MangroveInvestmentPotential.defaultProps = {
  data: null,
  currentLocation: null,
  isCollapsed: false,
  slug: null,
  name: null,
  metadata: null,
};

export default MangroveInvestmentPotential;
