import orderBy from 'lodash-es/orderBy';

import { formatNumberNearestInteger, numberFormat } from '@/lib/format';

import type { PolarViewBox } from 'recharts/types/util/types';

import Tooltip from './tooltip';
import type { DataResponse } from './types';

const COLORS = {
  '0-700': '#EEB66B',
  '700-1400': '#E68518',
  '1400-2100': '#B84E17',
  '2100-2800': '#933A06',
  '2800-3500': '#5C4A3D',
};

/**
 * Pure transform of the blue-carbon API response into chart/legend data.
 * Extracted from `useMangroveBlueCarbon`'s `select` so the ordering, totals and
 * percentage logic can be unit-tested without React Query.
 */
export function getBlueCarbonData({ data, metadata }: DataResponse, location?: string) {
  const noData = !data?.length;

  const orderedData = orderBy(
    data.map((d) => ({
      ...d,
      shortLabel: Number(d.indicator.split('-', 1)[0]),
    })),
    'shortLabel'
  );

  const total = orderedData.reduce((prev, curr) => curr.value + prev, 0);

  const ChartData = orderedData.map((d) => ({
    label: d.indicator,
    value: d.value,
    color: COLORS[d.indicator],
    showValue: false,
    valueFormatted: numberFormat(d.value),
    tooltipLabelPercentage: 'Percentage',
    percentage: numberFormat((d.value * 100) / total),
  }));

  const { agb, toc, soc } = metadata;

  const config = {
    type: 'pie',
    data: ChartData,
    tooltip: {
      content: (properties) => {
        const { payload } = properties;
        if (!payload.length) return null;
        return <Tooltip {...properties} payload={properties.payload?.[0]?.payload?.payload} />;
      },
    },
    chartBase: {
      width: 30,
      margin: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      pies: {
        innerRadius: 80,
        outerRadius: 100,
        y: {
          // cy: '50%',
          // cx: '50%',
          value: 'blue-carbon',
          dataKey: 'value',
          customLabel: ({ viewBox }: { viewBox: PolarViewBox }) => {
            const { cx, cy } = viewBox;
            return (
              <g>
                <text
                  x={cx}
                  y={cy - 30}
                  className="recharts-text recharts-label-medium"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  <tspan alignmentBaseline="middle" fill="rgba(0,0,0,0.85)" fontSize="14">
                    Total
                  </tspan>
                </text>
                <text
                  x={cx}
                  y={cy}
                  className="recharts-text recharts-label-large"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  <tspan alignmentBaseline="middle" fill="rgba(0,0,0,0.85)" fontSize="28">
                    {numberFormat(toc / 1000000)}
                  </tspan>
                </text>
                <text
                  x={cx}
                  y={cy + 30}
                  className="recharts-text recharts-label-medium"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  <tspan alignmentBaseline="middle" fill="rgba(0,0,0,0.85)" fontSize="14">
                    Mt CO₂e
                  </tspan>
                </text>
              </g>
            );
          },
        },
      },
    },
    legend: {
      title: 'Total carbon density (t CO₂e / ha)',
      items: ChartData,
    },
  };

  return {
    data,
    metadata,
    agb: formatNumberNearestInteger(agb / 1000000),
    toc: formatNumberNearestInteger(toc / 1000000),
    soc: formatNumberNearestInteger(soc / 1000000),
    config,
    location,
    noData,
  };
}
