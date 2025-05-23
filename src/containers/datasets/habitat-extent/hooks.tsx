import { useMemo } from 'react';

import type { LayerProps, SourceProps } from 'react-map-gl';

import { useRouter } from 'next/router';

import { numberFormat } from 'lib/format';

import { analysisAtom } from 'store/analysis';
import { drawingToolAtom, drawingUploadToolAtom } from 'store/drawing-tool';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError, CanceledError } from 'axios';
import type { Visibility } from 'mapbox-gl';
import { useRecoilValue } from 'recoil';

import type { AnalysisResponse } from 'hooks/analysis';

import { useLocation } from 'containers/datasets/locations/hooks';
import type { LocationTypes } from 'containers/datasets/locations/types';

import CustomTooltip from 'components/chart/tooltip';
import type { UseParamsOptions } from 'types/widget';

import API, { AnalysisAPI } from 'services/api';

import type { DataResponse, ExtentData, Indicator } from './types';

const unitOptions = ['km²', 'ha'];

export const widgetSlug = 'habitat-extent';

// widget data
export function useMangroveHabitatExtent(
  params: UseParamsOptions,
  queryOptions: UseQueryOptions<ExtentData> = {},
  onCancel?: () => void
) {
  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0] as LocationTypes;
  const id = queryParams?.[1];
  const {
    data: { name: location, id: currentLocation, location_id },
  } = useLocation(id, locationType);
  const { enabled: isAnalysisEnabled } = useRecoilValue(analysisAtom);
  const { customGeojson } = useRecoilValue(drawingToolAtom);
  const { uploadedGeojson } = useRecoilValue(drawingUploadToolAtom);

  const geojson = customGeojson || uploadedGeojson;

  const fetchHabitatExtent = ({ signal }: { signal?: AbortSignal }) => {
    if (isAnalysisEnabled) {
      return AnalysisAPI.request<AnalysisResponse<DataResponse> | AxiosError>({
        method: 'post',
        url: '/analysis',
        data: {
          geometry: geojson,
        },
        params: {
          'widgets[]': 'mangrove_extent',
        },
        signal,
      })
        .then(({ data }) => data['mangrove_extent'])
        .catch((err: CanceledError<unknown> | AxiosError) => {
          if (err.code === 'ERR_CANCELED') onCancel?.();
          return err;
        });
    }

    return API.request<DataResponse>({
      method: 'GET',
      url: 'widgets/habitat_extent',
      params: {
        ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
        ...params,
      },
    }).then((response) => response.data);
  };

  const query = useQuery([widgetSlug, location_id, geojson], fetchHabitatExtent, {
    placeholderData: {
      data: [],
      metadata: {
        units: {
          habitat_extent_area: null,
          linear_coverage: null,
        },
      },
    },
    ...queryOptions,
  });

  const { data, isFetched, isFetching, isError, refetch } = query;
  const noData =
    location_id === 'custom-area'
      ? isFetched && data?.data?.reduce((acc, value) => acc + value.value, 0) === 0
      : isFetched && !data?.data?.length;

  const { unit, year } = params;
  const DATA = useMemo(() => {
    const metadata = data?.metadata;
    const years = metadata?.year?.sort();
    const currentYear = year || years?.[years?.length - 1];
    const dataByYear = data?.data?.filter(({ year: y }) => y === currentYear);
    const dataParsed = dataByYear?.reduce(
      (acc, d) => ({
        ...acc,
        year: d.year,
        [d.indicator]: d.value,
      }),
      {} as Indicator
    );

    // API improvement - fix typo in length
    const totalLength = metadata?.total_lenght;
    const mangroveArea = dataParsed?.habitat_extent_area;
    const mangroveCoastCoverage = dataParsed?.linear_coverage;
    const mangroveCoastCoveragePercentage = (mangroveCoastCoverage * 100) / totalLength || 0;
    const nonMangrove = totalLength - mangroveCoastCoverage;
    const defaultUnitLinearCoverage = metadata?.units?.linear_coverage;
    const area = unit === 'ha' ? mangroveArea * 100 : mangroveArea;
    const mangroveAreaLabel = `Coastline coverage in ${currentYear}`;

    const coastlineCoverage = unit === 'ha' ? mangroveCoastCoverage * 100 : mangroveCoastCoverage;
    const nonMangrovesCoverage = unit === 'ha' ? nonMangrove * 100 : nonMangrove;

    const LegendData = [
      {
        label: mangroveAreaLabel,
        value: numberFormat(mangroveCoastCoverage),
        unit: 'km',
        color: '#06C4BD',
      },
      {
        label: 'Non mangroves',
        value: numberFormat(nonMangrove),
        unit: 'km',
        color: '#ECECEF',
      },
    ];

    const TooltipData = {
      content: (properties) => <CustomTooltip {...properties} />,
    };

    const ChartData = [
      {
        label: mangroveAreaLabel,
        value: coastlineCoverage,
        color: '#06C4BD',
        settings: [
          {
            label: 'Percentage',
            value: numberFormat(mangroveCoastCoveragePercentage),
            unit: '%',
          },
          { label: 'Coverage', value: numberFormat(coastlineCoverage), unit },
        ],
      },
      {
        label: 'Non mangroves',
        value: nonMangrovesCoverage,
        color: '#ECECEF',
        settings: [
          {
            label: 'Percentage:',
            value: numberFormat(100 - mangroveCoastCoveragePercentage),
            unit: '%',
          },
          { label: 'Coverage:', value: numberFormat(nonMangrovesCoverage), unit },
        ],
      },
    ];
    const chartConfig = {
      type: 'pie',
      data: ChartData,
      tooltip: TooltipData,
      cartesianGrid: false,
      chartBase: {
        pies: {
          value: widgetSlug,
        },
      },
    };

    return {
      metadata,
      area: numberFormat(+area),
      nonMangrove: numberFormat(+nonMangrove),
      mangroveCoastCoveragePercentage: numberFormat(+mangroveCoastCoveragePercentage),
      totalLength: numberFormat(+totalLength),
      years: metadata?.year, // API improvement, change year to years as is an array
      units: metadata?.units,
      legend: LegendData,
      chartData: ChartData,
      config: chartConfig,
      location,
      defaultYear: currentYear,
      unitOptions,
      defaultUnitLinearCoverage,
      noData,
    };
  }, [data, unit, year, location, noData]);

  return useMemo(() => {
    return {
      isFetching,
      isError,
      refetch,
      data: DATA,
    } as typeof query;
  }, [data, isFetching, isError, refetch, DATA]);
}

export function useSource(): SourceProps {
  return {
    id: 'habitat_extent',
    type: 'vector',
    url: 'mapbox://globalmangrovewatch.20cshxs9,globalmangrovewatch.b1wlg2x7,globalmangrovewatch.2cws6y26,globalmangrovewatch.bgrhiwte,globalmangrovewatch.aokkuxu7,globalmangrovewatch.0l7s8iga,globalmangrovewatch.a08vpx09,globalmangrovewatch.7kyxxf0e,globalmangrovewatch.1cu4rmy9,globalmangrovewatch.6st408jz,globalmangrovewatch.1clkx4nk',
  };
}

export function useLayers({
  year,
  id,
  opacity,
  visibility = 'visible',
}: {
  year: number;
  id: LayerProps['id'];
  opacity?: number;
  visibility?: Visibility;
}): LayerProps[] {
  return year
    ? [
        {
          id: `${id}_${year}_line`,
          type: 'fill',
          source: 'habitat_extent',
          'source-layer': `mng_mjr_${year}`,
          paint: {
            'fill-color': '#06C4BD',
            'fill-opacity': ['interpolate', ['linear'], ['zoom'], 0, opacity * 1.2, 12, opacity],
          },
          layout: {
            visibility,
          },
        },
        {
          id: `${id}_${year}_fill`,
          type: 'line',
          source: 'habitat_extent',
          'source-layer': `mng_mjr_${year}`,
          paint: {
            'line-color': '#06C4BD',
            'line-opacity': opacity,
            'line-width': ['interpolate', ['linear'], ['zoom'], 0, 8, 12, 1],
            'line-blur': ['interpolate', ['linear'], ['zoom'], 0, 50, 12, 0],
          },
          layout: {
            visibility,
          },
        },
      ]
    : null;
}
