import { useCallback, useMemo } from 'react';

import type { SourceProps, LayerProps } from 'react-map-gl';

import { useRouter } from 'next/router';

import { numberFormat } from 'lib/format';

import { analysisAtom } from 'store/analysis';
import { drawingToolAtom } from 'store/drawing-tool';
import { BiomassYearSettings } from 'store/widgets/biomass';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError, CanceledError } from 'axios';
import { useRecoilValue } from 'recoil';

import type { AnalysisResponse } from 'hooks/analysis';

import { useLocation } from 'containers/datasets/locations/hooks';

import type { UseParamsOptions } from 'types/widget';

import API, { AnalysisAPI } from 'services/api';

import Tooltip from './tooltip';
import type { DataResponse, Data, BiomassData, ColorKeysTypes } from './types';

export const widgetSlug = 'aboveground_biomass';

const COLORS = ['#EAF19D', '#B8E98E', '#1B97C1', '#1C52A3', '#13267F'];

const getColorKeys = (data: Data[] = []) =>
  data.reduce((acc, d, i) => {
    return {
      ...acc,
      [d.indicator]: COLORS[i],
    };
  }, {} satisfies ColorKeysTypes);
// widget data
export function useMangroveBiomass(
  params?: UseParamsOptions,
  queryOptions?: UseQueryOptions<DataResponse>,
  onCancel?: () => void
): BiomassData {
  const currentYear = useRecoilValue(BiomassYearSettings);
  const { uploadedGeojson, customGeojson } = useRecoilValue(drawingToolAtom);
  const { enabled: isAnalysisEnabled } = useRecoilValue(analysisAtom);

  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0];
  const id = queryParams?.[1];
  const {
    data: { name: location, id: currentLocation, location_id },
  } = useLocation(locationType, id);

  const geojson = customGeojson || uploadedGeojson;

  const fetchMangroveBiomass = useCallback(
    async ({ signal }: { signal?: AbortSignal }) => {
      if (isAnalysisEnabled) {
        return AnalysisAPI.request<AnalysisResponse<DataResponse> | AxiosError>({
          method: 'post',
          url: '/analysis',
          data: {
            geometry: geojson,
          },
          params: {
            'widgets[]': 'mangrove_biomass',
          },
          signal,
        })
          .then(({ data }) => data['mangrove_biomass'])
          .catch((err: CanceledError<unknown> | AxiosError) => {
            if (err.code === 'ERR_CANCELED') onCancel?.();
            return err;
          });
      }

      return API.request<DataResponse>({
        method: 'GET',
        url: '/widgets/aboveground_biomass',
        params: {
          ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
          ...(!!currentYear && { year: currentYear }),
          ...params,
        },
      }).then(({ data }) => data);
    },
    [geojson, isAnalysisEnabled, location_id, currentLocation, currentYear, params, onCancel]
  );

  const query = useQuery([widgetSlug, params, geojson, location_id], fetchMangroveBiomass, {
    placeholderData: {
      data: [],
      metadata: {
        avg_aboveground_biomass: [
          {
            value: null,
          },
        ],
      },
    },
    ...queryOptions,
  });
  const { data, isError, isFetching, refetch } = query;
  const noData = !data?.data?.length;

  return useMemo(() => {
    const years = data?.metadata.year;
    const selectedYear = currentYear || years?.[years?.length - 1];
    const dataFiltered = data?.data?.filter(({ indicator }) => indicator !== 'total');

    const avgBiomassFiltered = data?.metadata?.avg_aboveground_biomass.find(
      ({ year }) => year === selectedYear
    )?.value;

    const unit = data?.metadata.units?.value;

    const colorKeys = getColorKeys(dataFiltered);
    const total = dataFiltered?.reduce((acc, d) => acc + d.value, 0);
    const ChartData = dataFiltered?.map((d) => ({
      label: d.indicator,
      value: (d.value * 100) / total,
      showValue: false,
      valueFormatted: `${numberFormat((d.value * 100) / total)} %`,
      color: colorKeys[d.indicator],
    }));

    const config = {
      type: 'pie',
      data: ChartData,
      dataKey: 'value',
      chartBase: {
        pies: {
          value: 'biomass',
        },
      },
      tooltip: {
        content: (properties) => {
          return <Tooltip {...properties} payload={properties.payload?.[0]?.payload?.payload} />;
        },
      },
      legend: {
        title: 'Aboveground biomass density (t / ha)',
        items: ChartData,
      },
    };

    return {
      mean: numberFormat(avgBiomassFiltered),
      unit,
      year: selectedYear,
      noData,
      config,
      location,
      isFetching,
      isError,
      refetch,
    };
  }, [data, isFetching, isError, refetch, currentYear, location]);
}

export function useSource(): SourceProps {
  const year = useRecoilValue(BiomassYearSettings);

  // TO - DO: update when client provides data for more years
  // const tiles = years.map<string>((year: number) => {
  //   return `https://mangrove_atlas.storage.googleapis.com/staging/tilesets/mangrove_aboveground_biomass-v3/${year}/{z}/{x}/{y}.png`;
  // });

  return {
    id: 'aboveground_biomass-source',
    type: 'raster',
    tiles: [
      `https://mangrove_atlas.storage.googleapis.com/staging/tilesets/mangrove_aboveground_biomass-v3/${year}/{z}/{x}/{y}.png`,
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
