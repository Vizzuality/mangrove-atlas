import { useMemo } from 'react';

import { AnyLayer, AnySourceData } from 'mapbox-gl';

import { Dataset } from 'types/datasets';

import { years } from './constants';

// import { useFoodscapes } from 'hooks/foodscapes';

// import { Settings } from 'components/map/legend/types';

// interface UseMangrovesLayerProps {
//   settings?: Partial<Settings>;
// }

// interface UseMangrovesLegendProps {
//   dataset: Dataset;
//   settings?: Settings;
// }


// export function useSource(): AnySourceData & { key: string } {
//   const { data } = useFoodscapes();

//   const band = 1;
//   const colormap = useMemo(() => {
//     const c = data.reduce((acc, v) => {
//       return {
//         ...acc,
//         [v.value]: v.color,
//       };
//     }, {});
//     return encodeURIComponent(JSON.stringify(c));
//   }, [data]);

//   if (!data || !data.length) {
//     return null;
//   }

//   return {
//     id: 'foodscapes-source',
//     key: `${band}-${colormap}`,
//     type: 'raster',
//     tiles: [
//       // `${process.env.NEXT_PUBLIC_TITILER_API_URL}/cog/tiles/WebMercatorQuad/{z}/{x}/{y}@1x.png?colormap={{COLOR_RAMP}}&bidx={{BAND}}`,
//       `${process.env.NEXT_PUBLIC_TITILER_API_URL}/cog/tiles/WebMercatorQuad/{z}/{x}/{y}@1x.png?colormap=${colormap}&bidx=${band}`,
//     ],
//   };
// }
const mangroveGainRasters = years.map(
    (year) => ({
      name: `gain_${year}`,
      filename: "gain",
      year,
      source: {
        type: "raster",
        minzoom: 0,
        maxzoom: 12,
      },
      env: "staging",
    })
  );
  
  const mangroveGainLayers = mangroveGainRasters.map(
    ({ name, year }) => ({
      layerId: name,
      year,
      minZoom: 0,
      maxZoom: 12,
    })
  );
  const mangroveLossRasters = years.map(
    (year) => ({
      name: `loss_${year}`,
      filename: "loss",
      year,
      source: {
        type: "raster",
        minzoom: 0,
        maxzoom: 12,
      },
      env: "staging",
    })
  );
  
  const mangroveLossLayers = mangroveLossRasters.map(
    ({ name, year }) => ({
      layerId: name,
      year,
      minZoom: 0,
      maxZoom: 12,
    })
  );
// export function useLayer({ settings = {} }: UseMangrovesLayerProps): AnyLayer {
//   const visibility = settings.visibility ?? true;
//   const layer = useMemo<AnyLayer>(() => {
//     return {
//       id: 'mangroves-layer',
//       type: 'raster',
//       paint: {
//         'raster-opacity': settings.opacity ?? 1,
//       },
//       layout: {
//         visibility: visibility ? 'visible' : 'none',
//       },
//     };
//   }, [settings, visibility]);

//   return layer;
// }

// export function useLegend({
//   dataset,
//   settings = {
//     opacity: 1,
//     visibility: true,
//     expand: true,
//   },
// }: UseMangrovesLegendProps) {
//   const { data: foodscapesData } = useFoodscapes();

//   const colormap = useMemo(() => {
//     const c = foodscapesData.reduce((acc, v) => {
//       return {
//         ...acc,
//         [v.value]: v.color,
//       };
//     }, {});
//     return encodeURIComponent(JSON.stringify(c));
//   }, [foodscapesData]);

//   const legend = useMemo(() => {
//     if (!foodscapesData || !foodscapesData.length) {
//       return null;
//     }

//     return {
//       id: dataset.id,
//       name: dataset.label,
//       colormap,
//       settings: settings,
//       settingsManager: {
//         opacity: true,
//         visibility: true,
//         expand: true,
//         info: true,
//       },
//     };
//   }, [dataset, colormap, settings, foodscapesData]);

//   return legend;
// }