import ee from '@google/earthengine';
import { HansenDataAsset } from '../geeAssets/HansenDataAsset';
import {  BaseCalculation } from './BaseCalculation';


class BlueCarbonCalculationsClass extends BaseCalculation {
  dataAsset = HansenDataAsset;

  calculateTotalTreeCover(collection: ee.FeatureCollection): ee.List {
    const image = this.dataAsset
      .getEEAsset()
      .select('treecover2000')
      .multiply(ee.Image.pixelArea())
      // Divide so values are in km2
      .divide(100 * 1000 * 1000);

      const reducers = ee.Reducer.histogram(20)
            .combine(ee.Reducer.minMax(), '', true)
            .combine(ee.Reducer.mean(),'', true )
            .combine(ee.Reducer.stdDev(), '', true)
            .combine(ee.Reducer.sum(), '', true);

      const regReducer = {
        collection: collection,
        reducer: reducers
      };

    return image.reduceRegions(regReducer).toList(10000);
  }
}

export const BlueCarbonCalculations = new BlueCarbonCalculationsClass();
