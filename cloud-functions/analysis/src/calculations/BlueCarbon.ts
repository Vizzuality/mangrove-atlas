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
    const reducerOpt = {
      geometry: feature.geometry(),
      scale: 30,
      maxPixels: 256 * 256 * 16,
      bestEffort: true
    }
    const image = ee.Image(this.dataAsset.getEEAsset()
                    .sort('system:index', false)
                    .first());
    const reducers = ee.Reducer.fixedHistogram({'min':0,'max':3500,'steps':5})

    // const bands = ee.List(['total_co2e'])  image.bandNames()
    // const reducerNames = [] //reducers.getOutputs()
    const out_names = ee.List(['total_co2e']) // _getOutNames
    const histogram = image.select('total_co2e')
          .reduceRegion({
            ...reducerOpt,
            reducer: reducers
          })
    const from = ee.List(['agb_co2e', 'soc_co2e','total_co2e'])
    const to = ee.List(['agb', 'soc', 'toc'])
    const totals = image.select(from).reduceRegion({
      ...reducerOpt,
      reducer: ee.Reducer.sum(),
    }).rename(from, to)
  return _formatOutput(image, histogram, out_names, histogramBucket, totals);

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
function _formatOutput(im: ee.Image, elm: ee.Dictionary, out_names, histogramBucket, totals: ee.Dictionary,): ee.Dictionary {
  const year = ee.Number.parse(ee.String(im.id()).split('_').get(-1))
  const histogram = ee.List(_remapHistogram(
    elm.getArray(out_names.get(0)),
    histogramBucket));

  return ee.Dictionary({
    'metadata':  ee.Dictionary({
      "location_id": "custom-area",
      "units": {
        "value": "CO2e/ha",
        "toc": "t CO₂e",
        "soc": "t CO₂e",
        "agb": "t CO₂e"
      },
      'year':ee.List([year])})
      .combine(totals)
  }).combine({'data': histogram});
}

function _getOutNames(bands, reducerNames): ee.List {
  return ee.List(bands.map(
    (i: ee.String) => {
      return reducerNames.map(
        (j: ee.String) => {
          return ee.String(i).cat('_').cat(j)
        })
    }
  )).flatten()
}

export const BlueCarbonCalculations = new BlueCarbonCalculationsClass();
