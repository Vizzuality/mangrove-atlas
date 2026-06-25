import ee from '@google/earthengine';
import { ExtentDataAsset } from '../geeAssets/ExtentDataAsset';
import { BaseCalculation } from './BaseCalculation';

class HabitatExtentCalculationsClass extends BaseCalculation {
  extentAsset = ExtentDataAsset;

  calculate(feature: ee.Feature): ee.Dictionary {
    const geometry = feature.geometry();

    const reduced: ee.Dictionary = this._buildExtentImage()
      .reduceRegion({
        reducer: ee.Reducer.sum(),
        geometry,
        maxPixels: 1e9,
        bestEffort: true,
        tileScale: 4,
      });

    const habitatExtent = this._extractHabitatExtent(reduced);

    return ee.Dictionary({
      "location_id": "custom-area",
      'data': habitatExtent,
      'metadata': {
        "units": {
          "habitat_extent_area": "km2"
        },
        'year': ee.List(habitatExtent.map((f: ee.ComputedObject) => ee.Dictionary(f).get('year'))),
      }
    });
  }

  // Renames b1–b41 to extent_1985–extent_2025, converts pixel count to km².
  _buildExtentImage(): ee.Image {
    const bandNames = ee.List.sequence(1, 41).map((n: ee.ComputedObject) => {
      return ee.String('extent_').cat(ee.Number(n).add(1984).format('%d'));
    });
    return (ee.Image(this.extentAsset.getEEAsset()) as ee.Image)
      .rename(bandNames)
      .multiply(ee.Image.pixelArea())
      .divide(1e6);
  }

  _extractHabitatExtent(reduced: ee.Dictionary): ee.List {
    return reduced.keys().sort().map((key: ee.ComputedObject) => {
      const k = ee.String(key);
      return ee.Dictionary({
        'value':     reduced.get(k),
        'year':      ee.Number.parse(k.slice(-4)),
        'indicator': 'habitat_extent_area',
      });
    });
  }
}

export const HabitatExtentCalculations = new HabitatExtentCalculationsClass();
