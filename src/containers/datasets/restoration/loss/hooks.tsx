import { useRouter } from 'next/router';

import { numberFormat } from 'lib/format';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import chroma from 'chroma-js';

import { useLocation } from 'containers/datasets/locations/hooks';

import type { UseParamsOptions } from 'types/widget';

import API from 'services/api';

import type { Data, DataResponse } from './types';

const getLossData = (data, unit) => {
  const lossData = data.filter(
    ({ indicator }) => indicator !== 'lost_area' && indicator !== 'mangrove_area'
  );

  // TO DO - this should come from API

  const dataParsed = [
    {
      indicator: 'total_loss',
      label: 'Total area loss',
      children: lossData.map((l) => ({
        ...l,
        valueFormatted: numberFormat(l.value),
        unit,
      })),
    },
  ];
  const indicators = dataParsed[0].children?.map((d) => d.indicator);
  const colorsScale = chroma.scale(['#7996F3', '#EB6240', '#A6CB10']).colors(indicators.length);

  const colors = indicators.reduce(
    (acc, indicator, index) => ({
      ...acc,
      [indicator]: colorsScale[index],
    }),
    {}
  );

  return dataParsed.map((d, index) => ({
    ...d,
    color: colors[index],
    children: d.children.map((child) => ({
      ...child,
      color: colors[child.indicator],
    })),
  }));
};
// widget data
export function useMangroveDegradationAndLoss(
  params?: UseParamsOptions,
  queryOptions?: UseQueryOptions<DataResponse, Error, Data>
) {
  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0];
  const id = queryParams?.[1];
  const {
    data: { name: location, id: currentLocation, location_id },
  } = useLocation(locationType, id);
  const fetchMangroveDegradationAndLoss = () =>
    API.request<DataResponse>({
      method: 'GET',
      url: '/widgets/degradation-and-loss',
      params: {
        ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
        ...params,
      },
    }).then((response) => response.data);

  return useQuery(['degradation-and-loss', params, location_id], fetchMangroveDegradationAndLoss, {
    select: ({ data, metadata }) => ({
      ...metadata,
      ...data,
      location,
      chartData: getLossData(data, metadata.units.degraded_area),
      unit: metadata.units.degraded_area,
      main_loss_driver: metadata.main_loss_driver || 'Commodities',
    }),
    ...queryOptions,
  });
}
