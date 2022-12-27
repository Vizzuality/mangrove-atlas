import { useMutation } from 'react-query';

import ANALYSIS from 'services/analysis';

export function useAnalysis({ geojson, widgets }) {

  const analysisRequest = () => {

    return ANALYSIS.request({
      method: 'POST',
      url: '/analysis',
      data: {
        geometry: {
          type: "FeatureCollection",
          features: geojson,
        },
      },
      signal: controller.signal,
      params: { widgets },
    });
  };

  return useMutation(analysisRequest, {
    onSuccess: (data, variables, context) => {
      console.info('Succces', data, variables, context);
    },
    onError: (error, variables, context) => {
      console.info('Error', error, variables, context);
    },
  });
}

