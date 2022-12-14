import ee from '@google/earthengine';
import { GainDataAsset } from '../geeAssets/GainDataAssets';
import { LossDataAsset } from '../geeAssets/LossDataAssets';
import {  BaseCalculation } from './BaseCalculation';


class NetChangeCalculationsClass extends BaseCalculation {
  Gain = GainDataAsset;
  Loss = LossDataAsset;

  calculate(feature: ee.Feature): ee.List {

    const geometry = feature.geometry();

    const gain = this._getGainLoss(this.Gain, geometry);
    const loss = this._getGainLoss(this.Loss, geometry);
    const netChange = this._netChange(gain, loss);

    return ee.Dictionary({
      'data': netChange,
      'metadata':{
        "location_id": "custom-area",
        "units": {
          "net_change": "km2",
          "gain": "km2",
          "loss": "km2"},
      'year': netChange.map((f: ee.Dictionary) => ee.Dictionary(f).get('year'))
      .unshift(1996) // add 1996 as the first element of the list
  }});
  }

  _getGainLoss(IC: ee.ImageCollection, geom: ee.Geometry): ee.List {
    const reducers = ee.Reducer.sum();
    return IC.getEEAsset().map(
      (image: ee.Image) => ee.Feature(null, image.rename(IC.name)
                          .multiply(ee.Image.pixelArea()).divide(1000*1000)
                          .reduceRegion({
                            reducer: reducers,
                            geometry: geom,
                            scale: 30,
                            maxPixels: 1e12,
                            bestEffort: true
                          })))
              .toList(10000)
  }
  _netChange(g: ee.List, l: ee.List): ee.Feature {
    return g.zip(l).map((list: ee.List) => {
          const item = ee.List(list);
          const ga = ee.Feature(item.get(0));
          const lo = ee.Feature(item.get(1));
          const year = ee.Number.parse(ee.String(lo.id()).slice(8,12));
          const net_change = ee.Number(ga.get('gain')).subtract(ee.Number(lo.get('loss')));

          return ga.toDictionary()
          .combine(lo.toDictionary())
          .combine(ee.Dictionary({'year':year, 'net_change': net_change}));
        })
  }
}

export const NetChangeCalculations = new NetChangeCalculationsClass();
