import { useMemo } from 'react';

import type { SourceProps, LayerProps } from 'react-map-gl';

import orderBy from 'lodash-es/orderBy';

import { useRouter } from 'next/router';

import { formatMillion, numberFormat } from 'lib/format';

import { analysisAtom } from 'store/analysis';
import { drawingToolAtom } from 'store/drawing-tool';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError, CanceledError } from 'axios';
import type { PolarViewBox } from 'recharts/types/util/types';
import { useRecoilValue } from 'recoil';

import type { AnalysisResponse } from 'hooks/analysis';

import { useLocation } from 'containers/datasets/locations/hooks';
import type { LocationTypes } from 'containers/datasets/locations/types';

import type { UseParamsOptions } from 'types/widget';

import API, { AnalysisAPI } from 'services/api';

import Tooltip from './tooltip';
import type { BlueCarbon, DataResponse } from './types';

export const widgetSlug = 'blue-carbon';

const COLORS = {
  '0-700': '#EEB66B',
  '700-1400': '#E68518',
  '1400-2100': '#B84E17',
  '2100-2800': '#933A06',
  '2800-3500': '#5C4A3D',
};

// widget data
export function useMangroveBlueCarbon(
  params?: UseParamsOptions,
  queryOptions?: UseQueryOptions<DataResponse>,
  onCancel?: () => void
) {
  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0] as LocationTypes;
  const id = queryParams?.[1];

  const {
    data: { name: location, id: currentLocation, location_id },
  } = useLocation(locationType, id);
  const { uploadedGeojson, customGeojson } = useRecoilValue(drawingToolAtom);
  const { enabled: isAnalysisEnabled } = useRecoilValue(analysisAtom);
  const geojson = customGeojson || uploadedGeojson;

  const fetchMangroveBlueCarbon = ({ signal }: { signal?: AbortSignal }) => {
    if (isAnalysisEnabled) {
      return AnalysisAPI.request<AnalysisResponse<DataResponse> | AxiosError>({
        method: 'post',
        url: '/analysis',
        data: {
          geometry: geojson,
        },
        params: {
          'widgets[]': 'mangrove_blue_carbon',
        },
        signal,
      })
        .then(({ data }) => data['mangrove_blue_carbon'])
        .catch((err: CanceledError<unknown> | AxiosError) => {
          if (err.code === 'ERR_CANCELED') onCancel?.();
          return err;
        });
    }

    return API.request<DataResponse>({
      method: 'GET',
      url: '/widgets/blue_carbon',
      params: {
        ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
        ...params,
      },
      ...queryOptions,
    }).then((response) => response.data);
  };

  const query = useQuery([widgetSlug, params, geojson, location_id], fetchMangroveBlueCarbon, {
    placeholderData: {
      data: [],
      metadata: {
        soc: null,
        toc: null,
        agb: null,
        units: null,
      },
    },
    ...queryOptions,
  });
  const { data, isFetched } = query;
  const noData = isFetched && !data?.data?.length;

  return useMemo(() => {
    const orderedData = orderBy(
      data?.data?.map((d) => ({
        ...d,
        shortLabel: Number(d.indicator.split('-', 1)[0]),
      })),
      'shortLabel'
    );

    const total = orderedData.reduce(
      (previous: number, current: { value: number }) => current.value + previous,
      0
    );

    const ChartData = orderedData.map((d) => ({
      label: d.indicator,
      value: d.value,
      color: COLORS[d.indicator],
      showValue: false,
      valueFormatted: numberFormat(d.value),
      tooltipLabelPercentage: 'Percentage',
      percentage: numberFormat((d.value * 100) / total),
    }));

    const { agb, toc, soc } = data?.metadata;
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

    const DATA = {
      agb: numberFormat(agb / 1000000),
      toc: numberFormat(toc / 1000000),
      soc: numberFormat(soc / 1000000),
      config,
      location,
      noData,
    } satisfies BlueCarbon;

    return {
      ...query,
      data: DATA,
    } as typeof query & { data: typeof DATA };
  }, [query]);
}

export function useSource(): SourceProps {
  return {
    id: 'blue-carbon-source',
    type: 'raster',
    tiles: [
      'https://mangrove_atlas.storage.googleapis.com/tilesets/toc_co2eha-1_2016_z0z12/{z}/{x}/{y}.png',
    ],
    minzoom: 0,
    maxzoom: 12,
  };
}
export function useLayer({ id }: { id: LayerProps['id'] }): LayerProps {
  return {
    id,
    type: 'raster',
  };
}
