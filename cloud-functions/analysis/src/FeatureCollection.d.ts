export interface FeatureCollection {
  type: string,
  features: {
    type: string,
    properties: {
      [key: string]: any
    },
    geometry: {
      type: string,
      coordinates: number[]
    }
  }[]
}
