export interface AnalysisResponse {
  rows: {
    min: number,
    max: number,
    count: number,
    percent: number
  }[],
  fields: {
    min: { type: 'number' },
    max: { type: 'number' },
    count: { type: 'number' },
    percent: { type: 'number' }
  }
  total_rows: number,
  stats: {
    min: number,
    max: number,
    mean: number,
    stdev: number,
    sum: number
  }
}
