import ee from '@google/earthengine';
import { ChangeDataAsset } from '../geeAssets/ChangeDataAssets';
import { BaseCalculation } from './BaseCalculation';

const SCALE      = 30; // metres
const GAIN_CLASS = 1;
const LOSS_CLASS = 2;

class NetChangeCalculationsClass extends BaseCalculation {
  Change = ChangeDataAsset;

  calculate(feature: ee.Feature): ee.Dictionary {
    const geometry = feature.geometry();

    const ic = this.Change.getEEAsset().sort('system:time_start');

    // Create binary gain and loss stacks from the unified classification band.
    // Each image is renamed "{gain|loss}_{year}" before toBands() so that
    // _netChange() can filter keys by "_gain_" / "_loss_" and read year from
    // the trailing 4 characters — identical to the v3 key-parsing logic.
    const gainStack = ic.map((img: ee.ComputedObject) => {
      const image = ee.Image(img);
      const year = ee.Number(image.get('change_year')).toInt().format('%d');
      return image.select('classification').eq(GAIN_CLASS)
        .rename(ee.String('gain_').cat(year));
    }).toBands();

    const lossStack = ic.map((img: ee.ComputedObject) => {
      const image = ee.Image(img);
      const year = ee.Number(image.get('change_year')).toInt().format('%d');
      return image.select('classification').eq(LOSS_CLASS)
        .rename(ee.String('loss_').cat(year));
    }).toBands();

    const reduced = gainStack.addBands(lossStack)
      .multiply(ee.Image.pixelArea().divide(1000 * 1000))
      .reduceRegion({
        reducer: ee.Reducer.sum(),
        geometry,
        scale: SCALE,
        maxPixels: 1e12,
        bestEffort: true,
        tileScale: 4,
      });

    const netChange = this._netChange(reduced);

    return ee.Dictionary({
      'data': netChange,
      'metadata': {
        'location_id': 'custom-area',
        'units': {
          'net_change': 'km2',
          'gain':       'km2',
          'loss':       'km2',
        },
        'year': netChange.map((f: ee.ComputedObject) => ee.Dictionary(f).get('year')),
      },
    });
  }

  // Reconstructs per-year rows from the combined gain+loss reduced dictionary.
  // Keys from toBands() are "{index}_gain_{year}" / "{index}_loss_{year}";
  // year is the trailing 4 chars of each key.
  _netChange(reduced: ee.Dictionary): ee.List {
    const gainKeys = reduced.keys()
      .filter(ee.Filter.stringContains('item', '_gain_')).sort();
    const lossKeys = reduced.keys()
      .filter(ee.Filter.stringContains('item', '_loss_')).sort();

    const rows = gainKeys.zip(lossKeys).map((pair: ee.ComputedObject) => {
      const p       = ee.List(pair);
      const gainKey = ee.String(p.get(0));
      const lossKey = ee.String(p.get(1));
      const year    = gainKey.slice(-4);
      const gainVal = ee.Number(reduced.get(gainKey));
      const lossVal = ee.Number(reduced.get(lossKey));
      return ee.Dictionary({
        'year':       ee.Number.parse(year),
        'gain':       gainVal,
        'loss':       lossVal,
        'net_change': gainVal.subtract(lossVal),
      });
    });

    // 1985 is the base year of the v4 dataset; no change data exists for it.
    // A zero row anchors the start of the timeline for the frontend.
    return ee.List(rows).insert(0, ee.Dictionary({
      'year': 1985,
      'gain': 0,
      'loss': 0,
      'net_change': 0,
    }));
  }
}

export const NetChangeCalculations = new NetChangeCalculationsClass();
