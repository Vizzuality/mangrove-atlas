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

  // Stacks all images into a single multi-band image using toBands() (faster than iterate()).
  // Band names from toBands() are "{system:index}_{name}_{year}"; year is always the last 4 chars.
  _getGainLoss(IC: IGainLossAsset, geom: ee.Geometry): ee.Dictionary {
    const collection: ee.ImageCollection = IC.getEEAsset();

    // system:index format: "gl_{start}_{end}_{type}" → year at slice(8, 12)
    const stacked = collection.sort('system:index')
      .map((img: ee.ComputedObject) => {
        const image = ee.Image(img);
        const year = ee.String(image.get('system:index')).slice(8, 12);
        return image.rename(ee.String(IC.name).cat('_').cat(year));
      })
      .toBands()
      .multiply(ee.Image.pixelArea())
      .divide(1000 * 1000);

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
  // Keys from toBands() are "{system:index}_{name}_{year}"; year is the trailing 4 chars.
  // Zip sorted gain/loss key lists — both collections share the same year sequence.
  _netChange(gainDict: ee.Dictionary, lossDict: ee.Dictionary): ee.List {
    const pairs = gainDict.keys().sort().zip(lossDict.keys().sort());

    const rows = pairs.map((pair: ee.ComputedObject) => {
      const p = ee.List(pair);
      const gainKey = ee.String(p.get(0));
      const lossKey = ee.String(p.get(1));
      const year = gainKey.slice(-4);
      const gainVal = ee.Number(gainDict.get(gainKey));
      const lossVal = ee.Number(lossDict.get(lossKey));
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
