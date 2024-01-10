import { useMemo } from 'react';

import type { SourceProps, LayerProps } from 'react-map-gl';

import { useRouter } from 'next/router';

import { numberFormat } from 'lib/format';

import { analysisAtom } from 'store/analysis';
import { drawingToolAtom, drawingUploadToolAtom } from 'store/drawing-tool';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError, CanceledError } from 'axios';
import { AxiosResponse } from 'axios';
import type { Visibility } from 'mapbox-gl';
import { useRecoilValue } from 'recoil';

import type { AnalysisResponse } from 'hooks/analysis';

import { useLocation } from 'containers/datasets/locations/hooks';
import type { LocationTypes } from 'containers/datasets/locations/types';

import type { UseParamsOptions } from 'types/widget';

import API, { AnalysisAPI } from 'services/api';

import Tooltip from './tooltip';
import type { Data, DataResponse, ColorKeysTypes } from './types';

export const widgetSlug = 'tree-height';

const COLORS = ['#C9BB42', '#8BA205', '#428710', '#0A6624', '#103C1F'];

const getColorKeys = (data: Data[]) =>
  data?.reduce((acc, d, i) => {
    return {
      ...acc,
      [d.indicator]: COLORS[i],
    };
  }, {} satisfies ColorKeysTypes);

const getData = (data: Data[], unit, COLORS_BY_INDICATOR: ColorKeysTypes) => {
  if (!data || !data?.length) return null;
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
  const { customGeojson } = useRecoilValue(drawingToolAtom);
  const { uploadedGeojson } = useRecoilValue(drawingUploadToolAtom);
  const { enabled: isAnalysisEnabled } = useRecoilValue(analysisAtom);
  const geojson = useMemo(() => customGeojson || uploadedGeojson, [customGeojson, uploadedGeojson]);

  const fetchMangroveHeight = ({ signal }: { signal?: AbortSignal }) => {
    if (isAnalysisEnabled) {
      return AnalysisAPI.request<AnalysisResponse<DataResponse> | AxiosError>({
        method: 'post',
        url: '/analysis',
        data: {
          geometry: geojson,
        },
        params: {
          'widgets[]': 'mangrove_height',
        },
        signal,
      })
        .then(({ data }) => data['mangrove_height'])
        .catch((err: CanceledError<unknown> | AxiosError) => {
          if (err.code === 'ERR_CANCELED') onCancel?.();
          return err;
        });
    }

    return API.request({
      method: 'GET',
      url: '/widgets/tree_height',
      params: {
        ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
        ...params,
      },
      ...queryOptions,
    }).then((response: AxiosResponse<DataResponse>) => response.data);
  };

  const query = useQuery([widgetSlug, params, geojson, location_id], fetchMangroveHeight, {
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

  const { data, isFetched } = query;
  const noData = isFetched && !data?.data?.length;

  const mean = data?.metadata?.avg_height?.[0]?.value;
  const unit = data?.metadata?.units?.value;
  const years = data?.metadata?.year || [];
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
      noData,
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
export function useLayer({
  id,
  opacity,
  visibility = 'visible',
}: {
  id: LayerProps['id'];
  opacity?: number;
  visibility?: Visibility;
}): LayerProps {
  return {
    id,
    type: 'raster',
    paint: {
      'raster-opacity': opacity,
    },
    layout: {
      visibility,
    },
  };
}
