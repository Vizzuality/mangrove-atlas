import ee from '@google/earthengine';
import { AbovegroundBiomassDataAsset } from '../geeAssets/AboveGroundDataAssets';
import {  BaseCalculation } from './BaseCalculation';


class BiomassCalculationsClass extends BaseCalculation {
  dataAsset = AbovegroundBiomassDataAsset;

  calculate(feature: ee.Feature): ee.Dictionary {
    const histogramBucket = ee.Dictionary({
        0: '0-50',
        50: '50-100',
        100: '100-150',
        150: '150-250',
        250: '250-1600',
      });
    const image = ee.Image(this.dataAsset.getEEAsset()
                    .sort('system:index', false)
                    .first());
    // @TODO: this can be further simplified by ussing a recursive function
    const reducers = ee.Reducer.mean()
    .combine({
      reducer2: ee.Reducer.fixedHistogram({'min':0,'max':150,'steps':3})
      .combine({
        reducer2: ee.Reducer.fixedHistogram({'min':150,'max':250,'steps':1})
        .setOutputs(['second']),
        outputPrefix: '',
        sharedInputs: true
    }).combine({
      reducer2: ee.Reducer.fixedHistogram({'min':250,'max':1500,'steps':1})
      .setOutputs(['third']),
      outputPrefix: '',
      sharedInputs: true
  }).setOutputs(['first', 'second', 'third']),
      outputPrefix: '',
      sharedInputs: true
    })

    const bands = ee.List(['agb'])
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
  const histogramA = ee.List(_remapHistogram(
    elm.getArray(out_names.get(1)),
    histogramBucket));
  const histogramB = ee.List(_remapHistogram(
    elm.getArray(out_names.get(2)),
    histogramBucket));
  const histogramC = ee.List(_remapHistogram(
    elm.getArray(out_names.get(3)),
    histogramBucket));

  return ee.Dictionary({
    'metadata':  {
      'year':year,
      'avg': elm.get(out_names.get(0), null)
  }
  }).combine({'data': histogramA.cat(histogramB).cat(histogramC)});
}

export const BiomassCalculations = new BiomassCalculationsClass();
