import { useMemo } from 'react';

import sortBy from 'lodash-es/sortBy';

import { useRouter } from 'next/router';

import { numberFormat } from 'lib/format';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { useLocation } from 'containers/datasets/locations/hooks';
import type { RouterData } from 'containers/widgets/types';

import API from 'services/api';

import Tooltip from './tooltip';
import type { CarbonMarketPotentialData, UseParamsOptions, ChartLabelProps, Unit } from './types';

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
  queryOptions: UseQueryOptions<CarbonMarketPotentialData, unknown> = {} // API
) {
  const {
    query: { locationType, id },
  } = useRouter();
  const {
    data: { name, id: currentLocation, location_id },
  }: RouterData = useLocation(locationType, id);

  const location = useMemo(() => {
    if (location_id === 'custom-area') return 'the area selected';
    if (location_id === 'worldwide') return 'the world';
    else return name;
  }, [location_id]);

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
        metadata: null,
      },
      ...queryOptions,
    }
  );
  const { isLoading, isFetched, isPlaceholderData, data } = query;

  const investibleBlueCarbonValue = useMemo(
    () => data?.data?.find((d) => d.label === label)?.value,
    [data?.data, label]
  );

  const chartData = sortBy(
    data?.data?.map((d) => {
      const hasLabel = d.label.toLowerCase() !== d.category;
      const labelDisplayed = `${CATEGORY_DICTIONARY[d.category]} ${hasLabel ? d.label : ''}`;
      return {
        category: labelDisplayed,
        label: hasLabel ? d.label : null,
        value: d.value,
        color: COLORS[d.category],
        description: d.description,
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
    'value'
  );

  const CONFIG = {
    type: 'pie',
    data: chartData,
    chartBase: {
      pies: {
        y: {
          value: 'carbon-market-potential',
          dataKey: 'percentage',
          labelLine: false,
          label: (props) => {
            const {
              cx,
              cy,
              midAngle,
              endAngle,
              outerRadius,
              category,
              percentage,
              index,
            }: ChartLabelProps = props;
            const RADIAN = Math.PI / 180;
            const sin = Math.sin(-RADIAN * midAngle);
            const cos = Math.cos(-RADIAN * midAngle);
            const mx = cx + outerRadius * cos;
            const my = cy + outerRadius * sin;
            const ex = mx + (cos >= 0 ? 1 : -1) * 12 - (cos >= 0 ? 0 : 130);
            const ey = my;
            const heightMargin = percentage < 5 ? 16 : 6;
            const top = endAngle < cy ? 6 : 0;
            return (
              <g>
                <foreignObject
                  x={ex + (cos >= 0 ? 1 : -6)}
                  y={ey - heightMargin * index - top}
                  height="30px"
                  width="125px"
                >
                  <div
                    style={{
                      marginTop: 5,
                      marginBottom: 5,
                      display: 'flex',
                      color: '#A5A5A5',
                      lineHeight: '10px',
                      width: '100%',
                      fontSize: '11px',
                    }}
                  >
                    {category}
                  </div>
                </foreignObject>
              </g>
            );
          },
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
  };

  const DATA = useMemo(
    () =>
      ({
        data: chartData,
        location,
        labels,
        units,
        investibleBlueCarbonValue,
        config: CONFIG,
      } satisfies CarbonMarketPotentialData),
    [query.data]
  );

  return useMemo(() => {
    return {
      isLoading,
      isFetched,
      isPlaceholderData,
      data: DATA,
    } as typeof query;
  }, [query, DATA]);
}