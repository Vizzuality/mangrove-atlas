import React, {
  useCallback, useEffect, useState,
} from 'react';
import PropTypes from 'prop-types';

import { format } from 'd3-format';

import Select from 'components/select';
import ChartWidget from 'components/chart-widget';

import config from './config';

const numberFormat = format(',.0f');

const labelOptions = [
  {
    label: 'at $5/ton',
    value: 5,
  },
  {
    label: 'at $10/ton',
    value: 10,
  },
];

const unitsOptions = [
  {
    label: 'ha',
    value: 'ha',
  },
  {
    label: 'km²',
    value: 'km2',
  },
  {
    label: 'm²',
    value: 'm2',
  },
];

function MangroveInvestmentPotential({
  data,
  metadata,
  currentLocation,
  isCollapsed = true,
  slug,
  name,
  fetchInvestmentPotentialData,
  ...props
}) {
  const [investibleBlueCarbon, setInvestibleBlueCarbon] = useState(labelOptions[0].value);
  const [selectedUnit, setUnit] = useState(unitsOptions[0]);

  useEffect(() => {
    fetchInvestmentPotentialData({
      ...(currentLocation?.iso?.toLowerCase() !== 'worldwide' && {
        location_id: currentLocation.id,
      }),
      ...selectedUnit && {
        units: selectedUnit.value,
      },
    });
  }, [currentLocation, selectedUnit, fetchInvestmentPotentialData]);

  const labelHandler = useCallback((value) => {
    setInvestibleBlueCarbon(value);
  }, [setInvestibleBlueCarbon]);

  const unitsHandler = useCallback((v) => {
    const currentUnit = unitsOptions.find(({ value }) => value === v);
    setUnit(currentUnit);
  }, [setUnit]);

  if (!data || Object.entries(data).length === 0) {
    return null;
  }

  const {
    chartData,
    chartConfig,
  } = config.parse(data);

  const investibleBlueCarbonValue = data.find(({ label }) => label.includes(investibleBlueCarbon));

  const labelSelector = (
    <Select
      value={investibleBlueCarbon}
      options={labelOptions}
      onChange={labelHandler}
    />
  );

  const unitsSelector = (
    <Select
      value={selectedUnit.value}
      options={unitsOptions}
      onChange={unitsHandler}
    />
  );

  if (!chartData || chartData.length <= 0) {
    return null;
  }

  const locationName = currentLocation.location_type === 'worldwide' ? (
    'The world'
  ) : (
    <span className="notranslate">{`${currentLocation?.name}`}</span>
  );

  const sentence = (
    <>
      The extent of investible blue carbon (ha)
      {' '}
      <strong>{labelSelector}</strong>
      {' '}
      in
      {' '}
      <strong>{locationName}</strong>
      {' '}
      is
      {' '}
      <strong>
        {numberFormat(investibleBlueCarbonValue?.value)}
        {' '}
        {unitsSelector}
      </strong>
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
  data: PropTypes.arrayOf(PropTypes.shape({})),
  currentLocation: PropTypes.shape({
    iso: PropTypes.string,
    location_type: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string,
  }),
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
