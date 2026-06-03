import ee from '@google/earthengine';
import { GainDataAsset, IGainDataAsset } from '../geeAssets/GainDataAssets';
import { LossDataAsset, ILossDataAsset } from '../geeAssets/LossDataAssets';
import {  BaseCalculation } from './BaseCalculation';

type IGainLossAsset = IGainDataAsset | ILossDataAsset;

class NetChangeCalculationsClass extends BaseCalculation {
  Gain = GainDataAsset;
  Loss = LossDataAsset;

  calculate(feature: ee.Feature): ee.Dictionary {

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
      'year': (netChange.map((f: ee.ComputedObject) => ee.Dictionary(f).get('year')))
  }});
  }

  // Returns a flat ee.Dictionary with keys "{name}_{year}" and values in km².
  // A single reduceRegion covers all years to avoid concurrent aggregation limits.
  _getGainLoss(IC: IGainLossAsset, geom: ee.Geometry): ee.Dictionary {
    const collection: ee.ImageCollection = IC.getEEAsset();
    const images = collection.sort('system:index').toList(100);

    // system:index format: "gl_{start}_{end}_{type}" → year at slice(8, 12)
    const first = ee.Image(images.get(0));
    const firstYear = ee.String(first.get('system:index')).slice(8, 12);
    const init = first.rename(ee.String(IC.name).cat('_').cat(firstYear));

    const stacked = ee.Image(
      images.slice(1).iterate(
        (img: ee.ComputedObject, acc: ee.ComputedObject): ee.ComputedObject => {
          const image = ee.Image(img);
          const year = ee.String(image.get('system:index')).slice(8, 12);
          return ee.Image(acc).addBands(image.rename(ee.String(IC.name).cat('_').cat(year)));
        },
        init
      )
    ).multiply(ee.Image.pixelArea()).divide(1000 * 1000);

    return stacked.reduceRegion({
      reducer: ee.Reducer.sum(),
      geometry: geom,
      scale: 30,
      maxPixels: 1e12,
      bestEffort: true,
      tileScale: 4,
    });
  }

  // Reconstructs per-year rows from the flat gain/loss dictionaries.
  // Band names are "{name}_{year}" so slice(5) strips the "gain_"/"loss_" prefix.
  _netChange(gainDict: ee.Dictionary, lossDict: ee.Dictionary): ee.List {
    const years = gainDict.keys().sort().map(
      (key: ee.ComputedObject) => ee.String(key).slice(5) // remove "gain_" prefix
    );

    const rows = years.map((yr: ee.ComputedObject) => {
      const year = ee.String(yr);
      const gainVal = ee.Number(gainDict.get(ee.String('gain_').cat(year)));
      const lossVal = ee.Number(lossDict.get(ee.String('loss_').cat(year)));
      return ee.Dictionary({
        'year':       ee.Number.parse(year),
        'gain':       gainVal,
        'loss':       lossVal,
        'net_change': gainVal.subtract(lossVal),
      });
    });

    return ee.List(rows).insert(0, ee.Dictionary({
      "gain": 0,
      "loss": 0,
      "net_change": 0,
      "year": 1996
    }));
  }
}

export const NetChangeCalculations = new NetChangeCalculationsClass();
