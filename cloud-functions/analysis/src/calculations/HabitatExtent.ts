import ee from '@google/earthengine';
import { ExtentDataAsset } from '../geeAssets/ExtentDataAsset';
import {  BaseCalculation } from './BaseCalculation';


class HabitatExtentCalculationsClass extends BaseCalculation {
  dataAsset = ExtentDataAsset;

  calculate(feature: ee.Feature): ee.List {

    const asset = this.dataAsset.getEEAsset();
    const reducers = ee.Reducer.sum();

    return asset.map(
      (image: ee.Image) => ee.Feature(null, image.rename('extent'
      ).multiply(ee.Image.pixelArea()).reduceRegion({
        reducer: reducers,
        geometry: feature.geometry(),
        scale: 30,
        maxPixels: 1e12,
        bestEffort: true
      }))
    ).toList(10000).map(
      (i: ee.Feature) => {
        const feature = ee.Feature(i);
        const year = ee.Number.parse(ee.String(feature.id()).slice(7,11));
        return feature.set('year', year).toDictionary();
      }
    );
  }
}

export const HabitatExtentCalculations = new HabitatExtentCalculationsClass();
