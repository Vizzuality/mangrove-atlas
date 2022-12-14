import ee from '@google/earthengine';
import { ExtentDataAsset } from '../geeAssets/ExtentDataAsset';
import {  BaseCalculation } from './BaseCalculation';
import { CoastalExtentDataAsset } from '../geeAssets/CoastalExtentDataAsset';

class HabitatExtentCalculationsClass extends BaseCalculation {
  extentAsset = ExtentDataAsset;
  coastalAsset = CoastalExtentDataAsset

  calculate(feature: ee.Feature): ee.List {
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
        'year':ee.List(habitatExtent.map((f: ee.Dictionary) => ee.Dictionary(f).get('year'))),
        'total_lenght': totalCoastline}
      });
  }

  _getCoastalExtent(coast: ee.FeatureCollection, geo: ee.Geometry): ee.List {
    const coastlineImage = ee.Image().toByte().paint(coast, 1, 1).rename('value');

    const regionReducer = {
      reducer:ee.Reducer.sum(),
      geometry: geo,
      scale: 30,
      bestEffort: true
    };

    return this.extentAsset.getEEAsset().map((image: ee.Image) => {
      const mask = image.unmask()
                .distance(ee.Kernel.euclidean(200, 'meters'), true)
                .add(image.unmask());
      const year = ee.Number.parse(ee.String(image.id()).split('_').get(-1))

      return ee.Feature(null, ee.Dictionary(
        coastlineImage.updateMask(mask)
        .multiply(ee.Image.pixelArea()).sqrt().divide(1000)
        .reduceRegion(regionReducer)).combine(
          {
          'year': year,
          'indicator': 'linear_coverage'}
          )
        );
    }).toList(10000).map((i: ee.Feature) => {
        const feature = ee.Feature(i);
        return feature.toDictionary();
      }
    );
  }

  _getHabitatExtent(geo: ee.Geometry): ee.List {

    const reducers = ee.Reducer.sum();

    return this.extentAsset.getEEAsset().map(
      (image: ee.Image) => ee.Feature(null, ee.Dictionary(image.rename('value'
      ).multiply(ee.Image.pixelArea())
      .divide(1000 * 1000) // convert from m2 to km2
      .reduceRegion(
        {
        reducer: reducers,
        geometry: geo,
        scale: 30,
        maxPixels: 1e12,
        bestEffort: true
      }
      )).combine({
        'year': ee.Number.parse(ee.String(image.id()).split('_').get(-1)),
        'indicator': 'habitat_extent_area'}))
        ).toList(10000).map(
        (i: ee.Feature) => {
          const feature = ee.Feature(i);
          return feature.toDictionary();
        }
      );
  }
}

export const HabitatExtentCalculations = new HabitatExtentCalculationsClass();
