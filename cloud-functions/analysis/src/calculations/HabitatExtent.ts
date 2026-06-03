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

    // Adaptive scale: 30 m for small areas, capped at 120 m for large areas.
    // Reaches 60 m at ~1 000 km², 90 m at ~4 000 km², 120 m at ~9 000 km².
    const scale = ee.Number(geometry.area(1000))
      .divide(1e9).sqrt().multiply(30).add(30).max(30).min(120);

    const totalCoastline = ee.Number(ee.FeatureCollection(coastline.filterBounds(geometry))
                            .map((f: ee.Feature) => f.set({distance: f.length(10)}))
                            .aggregate_sum('distance'))
                            .divide(1000);

    // Combine extent (all years) and coastline into one image, single reduceRegion.
    // Extent bands carry km² values; the 'coastline' band carries km values.
    const reduced: ee.Dictionary = this._buildExtentImage()
      .addBands(this._buildCoastlineImage(coastline))
      .reduceRegion({
        reducer: ee.Reducer.sum(),
        geometry,
        scale,
        maxPixels: 1e12,
        bestEffort: true,
        tileScale: 4,
      });

    const habitatExtent = this._extractHabitatExtent(reduced);
    const coastalExtent = this._extractCoastalExtent(reduced);

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

  // Stacks all extent images into a multi-band image.
  // Bands are named "{system:index}_extent_{year}"; pixel area applied so sum() → km².
  _buildExtentImage(): ee.Image {
    // system:index format: "mangrove_extent-v3_YYYY" → year is last segment
    return this.extentAsset.getEEAsset().sort('system:index')
      .map((img: ee.ComputedObject) => {
        const image = ee.Image(img);
        const year = ee.String(image.get('system:index')).split('_').get(-1) as ee.String;
        return image.rename(ee.String('extent_').cat(year));
      })
      .toBands()
      .multiply(ee.Image.pixelArea())
      .divide(1000 * 1000);
  }

  // Paints the coastline FC, masks to within 200 m of mangroves, converts to km per pixel.
  // Produces a single band 'coastline'; sum() over the geometry yields linear coverage in km.
  _buildCoastlineImage(coast: ee.FeatureCollection): ee.Image {
    const coastlineImage = ee.Image().toByte().paint(coast, 1, 1).rename('value');
    const extentSample = ee.Image(this.extentAsset.getEEAsset().first());
    const mask = extentSample.unmask()
      .distance(ee.Kernel.euclidean(200, 'meters'), true)
      .add(extentSample.unmask());
    return coastlineImage.updateMask(mask)
      .multiply(ee.Image.pixelArea()).sqrt().divide(1000)
      .rename('coastline');
  }

  // Extracts per-year habitat extent rows from the combined reduced dictionary.
  // All keys except 'coastline' are extent bands; year is the trailing 4 chars.
  _extractHabitatExtent(reduced: ee.Dictionary): ee.List {
    const extentKeys = reduced.keys()
      .filter(ee.Filter.neq('item', 'coastline')).sort();
    return extentKeys.map((key: ee.ComputedObject) => {
      const k = ee.String(key);
      return ee.Dictionary({
        'value':     reduced.get(k),
        'year':      ee.Number.parse(k.slice(-4)),
        'indicator': 'habitat_extent_area',
      });
    });
  }

  // Replicates the single coastline length value across all extent years.
  _extractCoastalExtent(reduced: ee.Dictionary): ee.List {
    const coastlineLength = reduced.get('coastline');
    const extentKeys = reduced.keys()
      .filter(ee.Filter.neq('item', 'coastline')).sort();
    return extentKeys.map((key: ee.ComputedObject) => {
      return ee.Dictionary({
        'value':     coastlineLength,
        'year':      ee.Number.parse(ee.String(key).slice(-4)),
        'indicator': 'linear_coverage',
      });
    });
  }
}

export const HabitatExtentCalculations = new HabitatExtentCalculationsClass();
