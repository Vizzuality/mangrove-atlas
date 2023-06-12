import { useMemo } from 'react';

import type { SourceProps, LayerProps } from 'react-map-gl';

import orderBy from 'lodash-es/orderBy';

import { useRouter } from 'next/router';

import { analysisAtom } from 'store/analysis';
import { drawingToolAtom } from 'store/drawing-tool';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError, CanceledError } from 'axios';
import { AxiosResponse } from 'axios';
import { format } from 'd3-format';
import { useRecoilValue } from 'recoil';

import type { AnalysisResponse } from 'hooks/analysis';

import { useLocation } from 'containers/datasets/locations/hooks';

import CustomTooltip from 'components/chart/tooltip';

import API, { AnalysisAPI } from 'services/api';

import { Data, DataResponse, UseParamsOptions } from './types';

export const numberFormat = format(',.2~f');
export const smallNumberFormat = format('.4~f');
export const formatAxis = format(',.0d');

export const widgetSlug = 'net-change';

const unitOptions = ['km²', 'ha'];

const getFormat = (v) => {
  const decimalCount = -Math.floor(Math.log10(v) + 1) + 1;
  const formatByDecimals = format(`.${decimalCount === Infinity ? 1 : Math.abs(decimalCount)}~f`);
  return formatByDecimals(v);
};

const getWidgetData = (data: Data[], unit = '') => {
  if (!data?.length) return null;
  const firstYear = Math.min(...data.map((d) => d.year));
  const netChangeValues = data.map((d) => d.net_change);
  netChangeValues.shift();

  const cumulativeValuesNetChange = [0, ...netChangeValues]?.reduce(
    (acc, value, i) => {
      acc.push((acc[i] += value));
      return acc;
    },
    [0]
  );

  return orderBy(
    data.map((l, i) => {
      return {
        label: l.year,
        color: 'rgba(0,0,0,0.7)',
        year: l.year,
        'Net change':
          unit === 'ha' ? cumulativeValuesNetChange[i] * 100 : cumulativeValuesNetChange[i],
        Gain: l.year === firstYear ? 0 : unit === 'ha' ? l.gain * 100 : l.gain,
        Loss: l.year === firstYear ? 0 : unit === 'ha' ? -l.loss * 100 : -l.loss,
        settings: [
          {
            color: 'rgba(0,0,0,0.7)',

            label: 'Net change',
            value: numberFormat(
              unit === 'ha' ? cumulativeValuesNetChange[i] * 100 : cumulativeValuesNetChange[i]
            ),
            variant: 'thin',
            unit,
          },
        ],
        direction: 'vertical',
      };
    }),
    (l) => l.year
  );
};

// widget data
export function useMangroveNetChange(
  params: UseParamsOptions,
  queryOptions?: UseQueryOptions<DataResponse>,
  onCancel?: () => void
) {
  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0];
  const id = queryParams?.[1];
  const {
    data: { name: location, id: currentLocation, location_id },
  } = useLocation(locationType, id);
  const { uploadedGeojson, customGeojson } = useRecoilValue(drawingToolAtom);
  const { enabled: isAnalysisEnabled } = useRecoilValue(analysisAtom);
  const geojson = customGeojson || uploadedGeojson;

  const { startYear, endYear, selectedUnit, ...restParams } = params;
  const fetchMangroveNetChange = ({ signal }: { signal?: AbortSignal }) => {
    if (isAnalysisEnabled) {
      return AnalysisAPI.request<AnalysisResponse<DataResponse | AxiosError>>({
        method: 'post',
        url: '/analysis',
        data: {
          geometry: geojson,
        },
        params: {
          'widgets[]': 'mangrove_net_change',
        },
        signal,
      })
        .then(({ data }) => data['mangrove_net_change'])
        .catch((err: CanceledError<unknown> | AxiosError) => {
          if (err.code === 'ERR_CANCELED') onCancel?.();
          return err;
        });
    }

    return API.request({
      method: 'GET',
      url: '/widgets/net_change',
      params: {
        ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
        ...restParams,
      },
    }).then((response: AxiosResponse<DataResponse>) => response.data);
  };

  const query = useQuery([widgetSlug, restParams, geojson, location_id], fetchMangroveNetChange, {
    placeholderData: {
      data: [],
      metadata: null,
    },
    ...queryOptions,
  });

  const { data, isFetched } = query;

  const noData =
    location_id === 'custom-area'
      ? isFetched && data?.data?.reduce((acc, value) => acc + value.net_change, 0) === 0
      : isFetched && !data?.data?.length;

  return useMemo(() => {
    const years = data.metadata?.year.sort();
    const unit = selectedUnit || data.metadata?.units.net_change;
    const currentStartYear = startYear || years?.[0];
    const currentEndYear = endYear || years?.[years?.length - 1];
    const dataFiltered = data.data?.filter(
      (d) => d.year >= currentStartYear && d.year <= currentEndYear
    );
    const DATA = getWidgetData(dataFiltered, unit) || [];
    const TooltipData = {
      content: (properties) => <CustomTooltip {...properties} />,
    };

    const change = DATA[DATA.length - 1]?.['Net change'];

    const chartConfig = {
      type: 'composed',
      data: DATA,
      margin: { top: 40, right: 20, bottom: 20, left: 0 },
      referenceLines: [{ y: 0, label: null, stroke: 'rgba(0,0,0,0.5)' }],
      xAxis: {
        type: 'category',
        tick: { fontSize: 12, fill: 'rgba(0, 0, 0, 0.54)' },
        interval: 'equidistantPreserveStart',
      },
      yAxis: {
        tick: { fontSize: 12, fill: 'rgba(0, 0, 0, 0.54)' },
        tickFormatter: (v) => {
          const parsedNumber = unit === 'ha' ? v * 100 : v;
          const result = Number(getFormat(Math.abs(parsedNumber)));
          return result === 0 ? 0 : result;
        },
        tickMargin: 10,
        orientation: 'right',
        label: {
          value: unit === 'km2' ? 'km²' : unit,
          position: 'top',
          offset: 25,
        },
      },
      xKey: 'year',
      cartesianGrid: {
        vertical: false,
        strokeDasharray: '5 15',
      },
      tooltip: TooltipData,
      chartBase: {
        lines: {
          'Net change': {
            stroke: 'rgba(0,0,0,0.7)',
            isAnimationActive: false,
          },
        },
      },
    };
    const direction = change > 0 ? 'increased' : 'decreased';
    return {
      config: chartConfig,
      location,
      years,
      currentStartYear,
      currentEndYear,
      netChange: numberFormat(Math.abs(change)),
      direction,
      unitOptions,
      noData,
      ...query,
    };
  }, [data, query, startYear, endYear, location, selectedUnit]);
}

export function useSources(years: number[]): SourceProps[] {
  return years.map((year) => ({
    id: `net-change-${year}`,
    type: 'raster',
    tiles: [
      `https://mangrove_atlas.storage.googleapis.com/staging/tilesets/gain/${year}/{z}/{x}/{y}.png`,
      `https://mangrove_atlas.storage.googleapis.com/staging/tilesets/loss/${year}/{z}/{x}/{y}.png`,
    ],
    minZoom: 0,
    maxZoom: 12,
  }));
}
export function useLayer({ id }: { id: LayerProps['id'] }): LayerProps {
  return {
    id,
    type: 'raster',
  };
}
