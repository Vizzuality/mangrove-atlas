import ee from '@google/earthengine';
import { ExtentDataAsset } from '../geeAssets/ExtentDataAsset';
import {  BaseCalculation } from './BaseCalculation';
import { CoastalExtentDataAsset } from '../geeAssets/CoastalExtentDataAsset';

class HabitatExtentCalculationsClass extends BaseCalculation {
  extentAsset = ExtentDataAsset;
  coastalAsset = CoastalExtentDataAsset

  calculate(feature: ee.Feature): ee.Dictionary {
    const geometry = feature.geometry();
    const coastline = this.coastalAsset.getEEAsset();

    const habitatExtent =  this._getHabitatExtent(geometry);

    const coastalExtent = this._getCoastalExtent(coastline, geometry);


    const totalCoastline = ee.Number(ee.FeatureCollection(coastline.filterBounds(geometry))
                            .map((f: ee.Feature) => f.set({distance: f.length(10)}))
                            .aggregate_sum('distance'))
                            .divide(1000);

    return ee.Dictionary({
      "location_id": "custom-area",
      'data': ee.List(habitatExtent).cat(coastalExtent),
      'metadata':{
        "units": {
          "habitat_extent_area": "km2",
          "linear_coverage": "km"
        },
        'year': ee.List(habitatExtent.map((f: ee.ComputedObject) => ee.Dictionary(f).get('year'))),
        'total_lenght': totalCoastline}
      });
  }

  // Computes coastal coverage with a single reduceRegion. The maskedCoastline
  // image is constant across years, so the reduction is done once and the
  // value is replicated per year rather than firing N concurrent aggregations.
  _getCoastalExtent(coast: ee.FeatureCollection, geo: ee.Geometry): ee.List {
    const coastlineImage = ee.Image().toByte().paint(coast, 1, 1).rename('value');

    const extentSample = ee.Image(this.extentAsset.getEEAsset().first());
    const mask = extentSample.unmask()
      .distance(ee.Kernel.euclidean(200, 'meters'), true)
      .add(extentSample.unmask());

    const maskedCoastline = coastlineImage.updateMask(mask)
      .multiply(ee.Image.pixelArea()).sqrt().divide(1000);

    // Single reduction — coastline geometry does not change by year
    const coastlineLength: ee.Dictionary = maskedCoastline.reduceRegion({
      reducer: ee.Reducer.sum(),
      geometry: geo,
      scale: 30,
      bestEffort: true,
      tileScale: 4,
    });

    // Replicate across years using the extent collection as the year source
    const years = this.extentAsset.getEEAsset().sort('system:index').toList(10000)
      .map((img: ee.ComputedObject) => {
        // system:index format: "mangrove_extent-v3_YYYY" → year is last segment
        return ee.String(ee.Image(img).get('system:index')).split('_').get(-1);
      });

    return years.map((yr: ee.ComputedObject) => {
      return ee.Dictionary({
        'value':     coastlineLength.get('value'),
        'year':      ee.Number.parse(ee.String(yr)),
        'indicator': 'linear_coverage',
      });
    });
  }

  // Stacks all extent images into a single multi-band image (one band per year)
  // and performs a single reduceRegion instead of one per year.
  _getHabitatExtent(geo: ee.Geometry): ee.List {
    const collection: ee.ImageCollection = this.extentAsset.getEEAsset();
    const images = collection.sort('system:index').toList(10000);

    // system:index format: "mangrove_extent-v3_YYYY" → year is last segment
    const first = ee.Image(images.get(0));
    const firstYear = ee.String(first.get('system:index')).split('_').get(-1) as ee.String;
    const init = first.rename(ee.String('extent_').cat(firstYear));

    const stacked = ee.Image(
      images.slice(1).iterate(
        (img: ee.ComputedObject, acc: ee.ComputedObject): ee.ComputedObject => {
          const image = ee.Image(img);
          const year = ee.String(image.get('system:index')).split('_').get(-1) as ee.String;
          return ee.Image(acc).addBands(image.rename(ee.String('extent_').cat(year)));
        },
        init
      )
    ).multiply(ee.Image.pixelArea()).divide(1000 * 1000);

    const reduced: ee.Dictionary = stacked.reduceRegion({
      reducer: ee.Reducer.sum(),
      geometry: geo,
      scale: 30,
      maxPixels: 1e12,
      bestEffort: true,
      tileScale: 4,
    });

    // Reconstruct per-year rows from flat dictionary.
    // Band names are "extent_{year}" → slice(7) strips the "extent_" prefix.
    return reduced.keys().sort().map((key: ee.ComputedObject) => {
      const k = ee.String(key);
      const year = k.slice(7);
      return ee.Dictionary({
        'value':     reduced.get(k),
        'year':      ee.Number.parse(year),
        'indicator': 'habitat_extent_area',
      });
    });
  }
}

export const HabitatExtentCalculations = new HabitatExtentCalculationsClass();
