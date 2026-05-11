import { IDataAsset } from './EEDataset';
import ee from '@google/earthengine';

export interface IExtentDataAsset extends IDataAsset {
  numYears: number;
}

export const ExtentDataAsset: IExtentDataAsset = {
  assetPath: {
    default: "projects/mangrove-atlas-246414/assets/land-cover/mangrove_extent-v3"
  },
  numYears: 11,
  getEEAsset(){
    return ee.ImageCollection(this.assetPath.default);
  }
};
