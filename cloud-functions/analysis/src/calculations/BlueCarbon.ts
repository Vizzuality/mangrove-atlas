import ee from '@google/earthengine';
import { BlueCarbonDataAsset } from '../geeAssets/BlueCarbonDataAssets';
import {  BaseCalculation } from './BaseCalculation';


class BlueCarbonCalculationsClass extends BaseCalculation {
  dataAsset = BlueCarbonDataAsset;

  calculate(feature: ee.Feature): ee.Dictionary {
    const histogramBucket = ee.Dictionary({
        0: '0-700',
        700: '700-1400',
        1400: '1400-2100',
        2100: '2100-2800',
        2800: '2800-3500',
      });
    const image = ee.Image(this.dataAsset.getEEAsset()
                    .sort('system:index', false)
                    .first())
                    .select('total_co2e');
    const reducers = ee.Reducer.mean()
    .combine({
      reducer2: ee.Reducer.fixedHistogram({'min':0,'max':3500,'steps':5}),
      outputPrefix: '',
      sharedInputs: true
    })

    const bands = ee.List(['total_co2e'])
    const reducerNames = reducers.getOutputs()
    const out_names = ee.List(bands.map(
      (i: ee.String) => {
        return reducerNames.map(
          (j: ee.String) => {
            return ee.String(i).cat('_').cat(j)
          })
      }
    )).flatten();
    const reduced = image
          .reduceRegion({
            reducer: reducers,
            geometry: feature.geometry(),
            scale: 30,
            maxPixels: 256 * 256 * 16,
            bestEffort: true
          })
  return _formatOutput(image, reduced, out_names, histogramBucket);

  }
}

function _remapHistogram(arr: ee.Array<ee.Array>, buckets: ee.Dictionary): ee.Array<ee.Dictionary> {

  return ee.Algorithms.If(arr, ee.List(arr.toList().map((el) => {
    return ee.Algorithms.If(
      ee.Number(ee.Array(el).slice(0, 1, 2).get([0])).neq(0),
      ee.Dictionary({
      'indicator': buckets.get(ee.String(ee.Array(el).slice(0, 0, 1).get([0]).toInt())),
      'value': ee.Array(el).slice(0, 1, 2).get([0])
    }), null)
  }, true)),
  ee.List([])
  );
}
function _formatOutput(im: ee.Image, elm: ee.Dictionary, out_names, histogramBucket): ee.Dictionary {
  const year = ee.Number.parse(ee.String(im.id()).split('_').get(-1))
  const histogram = ee.List(_remapHistogram(
    elm.getArray(out_names.get(1)),
    histogramBucket));

  return ee.Dictionary({
    'metadata':  {
      'year':year,
      'avg': elm.get(out_names.get(0), null)
  }
  }).combine({'data': histogram});
}

export const BlueCarbonCalculations = new BlueCarbonCalculationsClass();
