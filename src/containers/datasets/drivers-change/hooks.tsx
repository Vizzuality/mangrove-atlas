import { useMemo } from 'react';

import type { SourceProps, LayerProps } from 'react-map-gl';

import { useRouter } from 'next/router';

import { numberFormat, percentFormat } from 'lib/format';

import { BiomassYearSettings } from 'store/widgets/biomass';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useRecoilValue } from 'recoil';

import Tooltip from 'containers/datasets/drivers-change/tooltip';
import type {
  DataResponse,
  Data,
  DriversChangeData,
  ColorKeysTypes,
} from 'containers/datasets/drivers-change/types';
import { useLocation } from 'containers/datasets/locations/hooks';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

const COLORS = ['#EAF19D', '#B8E98E', '#1B97C1', '#1C52A3', '#13267F'];

const getColorKeys = (data: Data[]) =>
  data.reduce((acc, d, i) => {
    return {
      ...acc,
      [d.indicator]: COLORS[i],
    };
  }, {} satisfies ColorKeysTypes);
// widget data
export function useMangroveDriversChange(
  params?: UseParamsOptions,
  queryOptions?: UseQueryOptions<DataResponse>
): DriversChangeData {
  const currentYear = useRecoilValue(BiomassYearSettings);

  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0];
  const id = queryParams?.[1];
  const {
    data: { name: location, id: currentLocation, location_id },
  } = useLocation(locationType, id);

  const fetchMangroveDriversChange = () =>
    API.request({
      method: 'GET',
      url: '/widgets/drivers_of_change',
      params: {
        ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
        ...(!!currentYear && { year: currentYear }),
        ...params,
      },
      ...queryOptions,
    }).then((response: AxiosResponse<DataResponse>) => response.data);

  const query = useQuery(['drivers_of_change', params], fetchMangroveDriversChange, {
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
  const { data, isLoading, isFetched, isPlaceholderData } = query;

  return useMemo(() => {
    const years = data?.metadata.year;
    const selectedYear = currentYear || years?.[years?.length - 1];
    const dataFiltered = data.data.filter(
      ({ indicator, year }) => indicator !== 'total' && year === selectedYear
    );

    const avgBiomassFiltered = data?.metadata.avg_aboveground_biomass.find(
      ({ year }) => year === selectedYear
    )?.value;

    const unit = data?.metadata.units?.value;

    const colorKeys = getColorKeys(dataFiltered);
    const ChartData = dataFiltered.map((d) => ({
      label: d.indicator,
      value: d.value,
      showValue: false,
      valueFormatted: percentFormat(d.value),
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
      config,
      isLoading,
      location,
      isFetched,
      isPlaceholderData,
    };
  }, [data]);
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
export function useLayer(): LayerProps {
  return {
    id: 'aboveground_biomass-layer',
    type: 'raster',
  };
}
