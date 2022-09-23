import ee from '@google/earthengine';
import { GainDataAsset } from '../geeAssets/GainDataAssets';
import { LossDataAsset } from '../geeAssets/LossDataAssets';
import {  BaseCalculation } from './BaseCalculation';


class NetChangeCalculationsClass extends BaseCalculation {
  Gain = GainDataAsset;
  Loss = LossDataAsset;

  calculate(feature: ee.Feature): ee.List {

    const reducers = ee.Reducer.sum();

    const gain = this.Gain.getEEAsset().map(
      (image: ee.Image) => ee.Feature(null, image.rename('gain'
      ).multiply(ee.Image.pixelArea()).reduceRegion({
        reducer: reducers,
        geometry: feature.geometry(),
        scale: 30,
        maxPixels: 1e12,
        bestEffort: true
      }))
    ).toList(10000)
    const loss = this.Loss.getEEAsset().map(
      (image: ee.Image) => ee.Feature(null, image.rename('loss'
      ).multiply(ee.Image.pixelArea()).reduceRegion({
        reducer: reducers,
        geometry: feature.geometry(),
        scale: 30,
        maxPixels: 1e12,
        bestEffort: true
      }))
    ).toList(10000)

    return ee.Dictionary({
      'data':gain.zip(loss)
        .map((list: ee.List) => {
          const item = ee.List(list);
          const gain = ee.Feature(item.get(0));
          const loss = ee.Feature(item.get(1));
          const year = ee.Number.parse(ee.String(loss.id()).slice(8,12));
          const net_change = ee.Number(gain.get('gain')).subtract(ee.Number(loss.get('loss')));
          return gain.toDictionary()
          .combine(loss.toDictionary())
          .combine(ee.Dictionary({'year':year, 'net_change': net_change}));
        }),
  'metadata':{

  }});
  }
}

export const NetChangeCalculations = new NetChangeCalculationsClass();
