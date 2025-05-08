import { useMemo } from 'react';

import Link from 'next/link';

import { numberFormat } from 'lib/format';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Rectangle } from 'recharts';
import { CartesianViewBox } from 'recharts/types/util/types';

import API from 'services/api';

import Tooltip from './tooltip';
import type { UseParamsOptions } from './types';

type DataResponse = {
  data: {
    name: string;
    iso: string;
    value: number;
  }[];
  metadata: {
    years: number[];
    start_year: number;
    end_year: number;
    units: { value: string }[];
  };
};

const widgetData = (data: DataResponse) =>
  data?.data?.map((d) => ({
    name: d.name,
    iso: d.iso,
    net_change: d.value,
  }));

// widget data
export function useMangroveHabitatChange(
  params?: UseParamsOptions,
  queryOptions?: UseQueryOptions<DataResponse>
) {
  const { startYear, endYear, limit } = params;
  const fetchMangroveHabitatChange = () => {
    return API.request({
      method: 'GET',
      url: '/widgets/country_ranking',
      params: {
        start_year: startYear,
        end_year: endYear,
        limit,
      },
      ...queryOptions,
    }).then((response) => response.data);
  };

  const query = useQuery(['country_ranking', params], fetchMangroveHabitatChange, {
    placeholderData: {
      data: [],
      metadata: null,
    },

    ...queryOptions,
  });

  const { data, isFetched, isPlaceholderData, isLoading } = query;
  const noData = isFetched && !data?.data?.length;

  return useMemo(() => {
    const years = data?.metadata?.years;
    const unit = data?.metadata?.units?.[0]?.value || [];
    const currentStartYear = startYear || years?.[0];
    const currentEndYear = endYear || years?.[years?.length - 1];

    const chartData = widgetData(data);

    // TO - DO - change when API gets correct values for gain and loss
    // let max = 0;
    // for (const data of chartData) {
    //   const absGain = Math.abs(data.gain);
    //   const absLoss = Math.abs(data.loss);
    //   max = Math.max(...[absGain, absLoss]);
    // }
    // const domainX = [-max * 1.05, max * 1.05];
    // const [startDomain, endDomain] = domainX;
    const allPositives = chartData.filter((d) => d.net_change > 0);

    const maxValue = numberFormat(Math.max(...chartData.map((d) => Math.abs(d.net_change))));

    const getDomainX = () => {
      if (allPositives.length === chartData.length) {
        return [0, maxValue];
      }
      if (!allPositives.length) {
        return [-maxValue, 0];
      } else return [-maxValue, Number(maxValue)];
    };
    const domainX = getDomainX();

    const CONFIG = {
      layout: 'vertical',
      height: limit === 5 ? 400 : (limit / 5) * 100 + 350,
      stackOffset: 'sign',
      margin: { top: 20, right: 0, left: 0, bottom: 20 },
      data: chartData,
      referenceLines: [{ x: 0, label: null, stroke: 'rgba(0,0,0,0.1)', strokeWidth: 2 }],
      dataKey: 'net_change',
      xAxis: {
        type: 'number',
        allowDecimals: false,
        interval: 'preserveStartEnd',
        domain: domainX,
        hiddenTicks: true,
        label: {
          value: 'km²',
          fontSize: 12,
          position: 'insideBottomRight',
        },
        tick: false,
      },
      yAxis: {
        type: 'category',
        width: 0,
      },
      chartBase: {
        bars: {
          gain: {
            barSize: 2,
            fill: '#A6CB10',
            legend: 'Gain',
            radius: [0, 10, 10, 0],
            stackId: '1',
            label: {
              content: (prs) => {
                const { index, y, x } = prs;
                const { name, iso } = chartData[index];
                return (
                  <foreignObject
                    x={x / 150}
                    y={y - 25}
                    height={20}
                    width="100%"
                    textAnchor="middle"
                    className="bg-white"
                  >
                    <Link
                      href={`/country/${iso}`}
                      className="w-full text-xs font-bold text-black/85"
                    >
                      <p className="text-center">{name}</p>
                    </Link>
                  </foreignObject>
                );
              },
            },
            isAnimationActive: false,
            shape: ({ x, y, width, height, fill }: CartesianViewBox & { fill: string }) => {
              const center = y + 3 + height / 2;
              return (
                <g>
                  <rect x={x} y={center} width={width} height={height} fill={fill} />
                  <line
                    x1={x + width}
                    y1={center - 4}
                    x2={x + width}
                    y2={center + 6}
                    stroke="#A6CB10"
                    strokeWidth={2}
                  />
                </g>
              );
            },
          },
          // TO - DO - put back when API gets correct data
          // loss: {
          //   barSize: 20,
          //   fill: '#EB6240',
          //   radius: [0, 10, 10, 0],
          //   stackId: '1',
          //   legend: 'Loss',
          //   isAnimationActive: faAssistiveListeningSystems,
          //   shape: ({ x, y, width, height, fill, ...props }) => {
          //     const center = y + 3 + (height / 2);
          //     return (
          //       <g>
          //         <rect
          //           x={x - Math.abs(width)}
          //           y={y + 3 + (height / 2)}
          //           width={Math.abs(width)}
          //           height={height}
          //           fill={fill}
          //         />
          //         <line
          //           x1={x + width}
          //           y1={center - 4}
          //           x2={x + width}
          //           y2={center + 6}
          //           stroke="#EB6240"
          //           strokeWidth={2}
          //         />
          //       </g>
          //     );
          //   }
          // },
          net_change: {
            barSize: 10,
            fill: 'rgba(0, 0, 0, 85)',
            stackId: '2',
            legend: 'Net change',
            shape: ({ x, y, width, height, fill }: CartesianViewBox & { fill: string }) => {
              return (
                <Rectangle
                  x={x}
                  y={y + 3 - height / 1.25}
                  width={width}
                  height={height}
                  fill={fill}
                  radius={[0, 10, 10, 0]}
                />
              );
            },
          },
        },
      },
      tooltip: {
        content: (properties) => <Tooltip {...properties} />,
      },

      cartesianGrid: {
        vertical: true,
        horizontal: false,
        strokeDasharray: '5 20',
      },
    };

    return {
      ...query,
      years,
      unit,
      chartData,
      currentStartYear,
      currentEndYear,
      config: CONFIG,
      noData,
    };
  }, [isFetched, isPlaceholderData, noData, isLoading, data]);
}
