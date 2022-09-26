import ee from '@google/earthengine';
import { ExtentDataAsset } from '../geeAssets/ExtentDataAsset';
import {  BaseCalculation } from './BaseCalculation';
import { CoastalExtentDataAsset } from '../geeAssets/CoastalExtentDataAsset';

class HabitatExtentCalculationsClass extends BaseCalculation {
  extentAsset = ExtentDataAsset;
  coastalAsset = CoastalExtentDataAsset

  calculate(feature: ee.Feature): ee.List {

    const reducers = ee.Reducer.sum();
    const habitatExtent =  this.extentAsset.getEEAsset().map(
      (image: ee.Image) => ee.Feature(null, ee.Dictionary(image.rename('value'
      ).multiply(ee.Image.pixelArea())
      .divide(1000 * 1000) // convert from m2 to km2
      .reduceRegion(
        {
        reducer: reducers,
        geometry: feature.geometry(),
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
    const coastalExtent = this.coastalAsset.getEEAsset().map(
      (image: ee.Image) => ee.Feature(null,
        ee.Dictionary(image.rename('value')
        .multiply(ee.Image.pixelArea())
        .divide(1000) // convert from m to km
        .reduceRegion(
          {
          reducer: reducers,
          geometry: feature.geometry(),
          scale: 30,
          maxPixels: 1e12,
          bestEffort: true
        }
        )).combine({
          'year': ee.Number.parse(ee.String(image.id()).split('_').get(-1)),
          'indicator': 'coastal_extent'}))
          ).toList(10000).map(
          (i: ee.Feature) => {
            const feature = ee.Feature(i);
            return feature.toDictionary();
          }
        );

    return ee.Dictionary({
      'data': ee.List(habitatExtent).cat(coastalExtent),
      'metadata':{}});
  }
}

export const HabitatExtentCalculations = new HabitatExtentCalculationsClass();
