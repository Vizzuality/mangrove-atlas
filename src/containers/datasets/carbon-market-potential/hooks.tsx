import { useMemo } from 'react';

import { useRouter } from 'next/router';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import sortBy from 'lodash-es/sortBy';

import { useLocation } from 'containers/datasets/locations/hooks';
import type { LocationTypes } from 'containers/datasets/locations/types';
import { numberFormat } from 'lib/format';
import API from 'services/api';

import Tooltip from './tooltip';
import type { CarbonMarketPotentialData, UseParamsOptions, Unit } from './types';

const labels = ['at $5/ton', 'at $10/ton'];

const units: Unit[] = [
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

const COLORS = {
  remaining: '#ff7f0f',
  protected: '#2da02b',
  carbon_10: '#1f78b4',
  carbon_5: '#d72729',
};

const CATEGORY_DICTIONARY = {
  carbon_5: 'Investible Blue Carbon',
  carbon_10: 'Additional Investible Blue Carbon',
  remaining: 'Remaining mangrove',
  protected: 'Area of Mangrove in Protected Areas',
};

// widget data
export function useCarbonMarketPotential(
  params?: UseParamsOptions,
  queryOptions: UseQueryOptions<CarbonMarketPotentialData, unknown> = {}, // API
) {
  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0] as LocationTypes;
  const id = queryParams?.[1];
  const {
    data: { name: location, id: currentLocation, location_id },
  } = useLocation(id, locationType);

  const { units: unit, label, ...rest } = params;
  const unitLabel = units.find((u) => u.value === unit)?.label;

  const fetchMangroveCarbonMarketPotential = () =>
    API.request({
      method: 'GET',
      url: '/widgets/blue-carbon-investment',
      params: {
        ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
        units: unit,
        ...rest,
      },
    }).then((response) => response.data);

  const query = useQuery(
    ['carbon-market-potential', location_id, unit],
    fetchMangroveCarbonMarketPotential,
    {
      placeholderData: {
        data: [],
        metadata: { unit: null },
      },
      ...queryOptions,
    },
  );
  const { isLoading, isFetched, isPlaceholderData, data } = query;
  const noData = isFetched && !data?.data?.length;

  const investibleBlueCarbonValue = useMemo(
    () => data?.data?.find((d) => d.label === label)?.value,
    [data?.data, label],
  );

  const chartData = sortBy(
    data?.data?.map((d) => {
      const hasLabel = d.label.toLowerCase() !== d.category;
      const labelDisplayed = `${CATEGORY_DICTIONARY[d.category]} ${hasLabel ? d.label : ''}`;
      return {
        category: labelDisplayed,
        label: d.label,
        value: d.value,
        color: COLORS[d.category],
        description: d.description,
        unit: data?.metadata.unit,
        percentage: d.percentage,
        settings: [
          { title: labelDisplayed },
          {
            label: 'Area',
            value: numberFormat(d.value),
            unit: unitLabel,
          },
          { label: 'Percentage', value: numberFormat(d.percentage), unit: '%' },
        ],
      };
    }),
    'value',
  );

  const CONFIG = {
    type: 'pie',
    data: chartData,
    dataKey: 'value',
    chartBase: {
      pies: {
        y: {
          value: 'carbon-market-potential',
          dataKey: 'percentage',
          labelLine: false,
        },
      },
    },
    tooltip: {
      content: (properties) => {
        const { payload } = properties;
        if (!payload.length) return null;
        return <Tooltip {...properties} settings={payload?.[0]?.payload?.settings} />;
      },
    },
    legend: {
      title: '',
      items: chartData,
    },
  };

  const DATA = useMemo(
    () => ({
      noData,
      location,
      labels,
      units,
      investibleBlueCarbonValue,
      config: CONFIG,
    }),
    [CONFIG, investibleBlueCarbonValue, location, noData],
  );

  return useMemo(() => {
    return {
      isLoading,
      isFetched,
      isPlaceholderData,
      data: DATA,
    } as typeof query;
  }, [DATA, isLoading, isFetched, isPlaceholderData]);
}
