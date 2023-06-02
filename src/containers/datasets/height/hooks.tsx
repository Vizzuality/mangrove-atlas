import { useMemo } from 'react';

import type { SourceProps, LayerProps } from 'react-map-gl';

import { useRouter } from 'next/router';

import { numberFormat } from 'lib/format';

import { analysisAtom } from 'store/analysis';
import { drawingToolAtom } from 'store/drawing-tool';
import { widgetYearAtom } from 'store/widgets';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useRecoilValue } from 'recoil';

import type { AnalysisResponse } from 'hooks/analysis';

import { useLocation } from 'containers/datasets/locations/hooks';

import type { UseParamsOptions } from 'types/widget';

import API, { AnalysisAPI } from 'services/api';

import Tooltip from './tooltip';
import type { Data, DataResponse, ColorKeysTypes } from './types';

const COLORS = ['#C9BB42', '#8BA205', '#428710', '#0A6624', '#103C1F'];

const getColorKeys = (data: Data[]) =>
  data.reduce((acc, d, i) => {
    return {
      ...acc,
      [d.indicator]: COLORS[i],
    };
  }, {} satisfies ColorKeysTypes);

const getData = (data: Data[], unit, COLORS_BY_INDICATOR: ColorKeysTypes) => {
  if (!data || !data.length) return null;
  const barsValues = data?.map(({ value }) => value);
  const total = barsValues.reduce((previous, current) => current + previous);
  return [
    data.reduce((acc, d) => {
      const percentage = (d.value / total) * 100;
      return {
        ...acc,
        year: d.year,
        [`${d.indicator} ${unit}`]: numberFormat(percentage),
        label: d.indicator,
        color: COLORS_BY_INDICATOR[d.indicator],
      };
    }, {}),
  ];
};

const getBars = (data: Data[], COLORS_BY_INDICATOR: ColorKeysTypes) =>
  data.reduce(
    (acc, d) => ({
      ...acc,
      [`${d.indicator} m`]: {
        stackId: 'bar',
        barSize: 60,
        fill: COLORS_BY_INDICATOR[d.indicator],
        stroke: COLORS_BY_INDICATOR[d.indicator],
        isAnimationActive: false,
        indicator: Number(d.indicator.replace('-', '')),
      },
    }),
    {}
  );

// widget data
export function useMangroveHeight(
  params?: UseParamsOptions,
  queryOptions?: UseQueryOptions<DataResponse>
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
  const currentYear = useRecoilValue(widgetYearAtom);
  const geojson = customGeojson || uploadedGeojson;

  const fetchMangroveHeight = () => {
    if (isAnalysisEnabled) {
      return AnalysisAPI.request<AnalysisResponse<DataResponse>>({
        method: 'post',
        url: '/analysis',
        data: {
          geometry: geojson,
        },
        params: {
          'widgets[]': 'mangrove_height',
        },
      }).then(({ data }) => data['mangrove_height']);
    }

    return API.request({
      method: 'GET',
      url: '/widgets/tree_height',
      params: {
        ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
        year: currentYear,
        ...params,
      },
      ...queryOptions,
    }).then((response: AxiosResponse<DataResponse>) => response.data);
  };

  const query = useQuery(['tree-height', params, geojson], fetchMangroveHeight, {
    placeholderData: {
      data: [],
      metadata: {
        year: [],
        avg_height: null,
        units: null,
      },
    },
    ...queryOptions,
  });

  const { data } = query;
  const mean = data?.metadata?.avg_height?.[0].value;
  const unit = data?.metadata?.units?.value;
  const years = data?.metadata?.year;
  const year = Math.max(...years);
  const COLORS_BY_INDICATOR = getColorKeys(data?.data);

  const chartData = getData(data?.data, unit, COLORS_BY_INDICATOR);

  const bars = useMemo(() => getBars(data?.data, COLORS_BY_INDICATOR), [data?.data]);
  const legendData = useMemo(
    () =>
      data?.data.map((d) => {
        return {
          label: d.indicator,
          color: COLORS_BY_INDICATOR[d.indicator],
        };
      }),
    [data?.data]
  );

  const TooltipData = {
    content: (properties) => <Tooltip {...properties} payload={properties.payload} />,
  };
  const dataMin = Math.min(...years);
  const dataMax = Math.max(...years);
  const config = {
    chartBase: {
      type: 'bar',
      bars: bars,
    },
    margin: {
      top: 40,
      bottom: 0,
      left: 0,
      right: 0,
    },
    data: chartData,
    xKey: 'year',
    xAxis: {
      tick: {
        fontSize: 12,
        lineHeight: 20,
        fill: 'rgba(0, 0, 0, 0.54)',
      },
      ticks: years,
      domain: [dataMin, dataMax],
    },
    yAxis: {
      tick: {
        fontSize: 12,
        fill: 'rgba(0,0,0,0.54)',
      },
      tickNumber: 5,
      width: 30,
      interval: 0,
      orientation: 'right',
      label: {
        value: '%',
        position: 'top',
        offset: 25,
        fontSize: 12,
      },
    },
    tooltip: TooltipData,
    cartesianGrid: {
      vertical: false,
      strokeDasharray: '5 15',
    },
  };

  return useMemo(() => {
    return {
      ...query,
      mean: numberFormat(mean),
      location,
      unit,
      year,
      legend: legendData,
      config,
    };
  }, [query, data]);
}

export function useSource(years: number[]): SourceProps {
  const tiles = years.map<string>((year: number) => {
    return `https://mangrove_atlas.storage.googleapis.com/staging/tilesets/mangrove_canopy_height-v3/${year}/{z}/{x}/{y}.png`;
  });

  return {
    id: 'mangrove_canopy_height-v3-source',
    type: 'raster',
    tiles,
    minzoom: 0,
    maxzoom: 12,
  };
}
export function useLayer(): LayerProps {
  return {
    id: 'mangrove_canopy_height-v3-layer',
    type: 'raster',
  };
}
