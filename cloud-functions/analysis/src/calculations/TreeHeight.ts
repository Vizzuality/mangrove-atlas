import ee from '@google/earthengine';
import { TreeHeightDataAsset } from '../geeAssets/TreeHeightDataAsset';
import {  BaseCalculation } from './BaseCalculation';


class TreeHeightCalculationsClass extends BaseCalculation {
  dataAsset = TreeHeightDataAsset;

  calculate(feature: ee.Feature): ee.Dictionary {
    const histogramBucket = ee.Dictionary({
        0: '0-5',
        5: '5-10',
        10: '10-15',
        15: '15-20',
        20: '20-65',
      });
    const image = ee.Image(this.dataAsset.getEEAsset()
                    .sort('system:index', false)
                    .first());
    const reducers = ee.Reducer.mean()
    .combine({
      reducer2: ee.Reducer.fixedHistogram({'min':0,'max':20,'steps':4})
      .combine({
        reducer2: ee.Reducer.fixedHistogram({'min':20,'max':65,'steps':1})
        .setOutputs(['second']),
        outputPrefix: '',
        sharedInputs: true
    }).setOutputs(['first', 'second']),
      outputPrefix: '',
      sharedInputs: true
    })

    const bands = ee.List(['height'])
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

  return ee.Dictionary({
    'metadata':  {
      'year':year,
      'avg': elm.get(out_names.get(0), null)
  }
  }).combine({'data': histogramA.cat(histogramB)});
}

export const TreeHeightCalculations = new TreeHeightCalculationsClass();
