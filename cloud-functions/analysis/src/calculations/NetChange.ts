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

    // Adaptive scale: 30 m for small areas, capped at 120 m for large areas.
    // Reaches 60 m at ~1 000 km², 90 m at ~4 000 km², 120 m at ~9 000 km².
    const scale = ee.Number(geometry.area(1000))
      .divide(1e9).sqrt().multiply(30).add(30).max(30).min(120);

    // Stack gain and loss into one image, then a single reduceRegion call.
    const stacked = this._stackCollection(this.Gain)
      .addBands(this._stackCollection(this.Loss))
      .multiply(ee.Image.pixelArea())
      .divide(1000 * 1000);

    const reduced = stacked.reduceRegion({
      reducer: ee.Reducer.sum(),
      geometry,
      scale,
      maxPixels: 1e12,
      bestEffort: true,
      tileScale: 4,
    });

    const netChange = this._netChange(reduced);

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

  // Returns a stacked image with one band per year, named "{system:index}_{name}_{year}".
  // Pixel area is applied in calculate() after gain and loss are combined.
  _stackCollection(IC: IGainLossAsset): ee.Image {
    // system:index format: "gl_{start}_{end}_{type}" → year at slice(8, 12)
    return IC.getEEAsset().sort('system:index')
      .map((img: ee.ComputedObject) => {
        const image = ee.Image(img);
        const year = ee.String(image.get('system:index')).slice(8, 12);
        return image.rename(ee.String(IC.name).cat('_').cat(year));
      })
      .toBands();
  }

  // Reconstructs per-year rows from the combined gain+loss reduced dictionary.
  // Keys from toBands() are "{system:index}_{name}_{year}"; gain/loss separated by key content.
  // Year is the trailing 4 chars of each key.
  _netChange(reduced: ee.Dictionary): ee.List {
    const gainKeys = reduced.keys()
      .filter(ee.Filter.stringContains('item', '_gain_')).sort();
    const lossKeys = reduced.keys()
      .filter(ee.Filter.stringContains('item', '_loss_')).sort();

    const rows = gainKeys.zip(lossKeys).map((pair: ee.ComputedObject) => {
      const p = ee.List(pair);
      const gainKey = ee.String(p.get(0));
      const lossKey = ee.String(p.get(1));
      const year = gainKey.slice(-4);
      const gainVal = ee.Number(reduced.get(gainKey));
      const lossVal = ee.Number(reduced.get(lossKey));
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
