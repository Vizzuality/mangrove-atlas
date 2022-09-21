import { arrSum } from './utils';
import { AnalysisResponse } from './AnalysisResponse';

export function serialize(originalData: any, indicator: string): AnalysisResponse {
  if (!originalData || !originalData.length) return null;

  // const countSum = arrSum(data.histogram);

  return originalData;
}
