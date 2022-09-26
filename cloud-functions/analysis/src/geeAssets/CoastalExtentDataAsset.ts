import { IDataAsset } from './EEDataset';
import ee from '@google/earthengine';

export interface IExtentDataAsset extends IDataAsset {
  numYears: number;
}

export const CoastalExtentDataAsset: IExtentDataAsset = {
  assetPath: {
    default: "projects/global-mangrove-watch/land-cover/mangrove_extent-v3"
  },
  numYears: 11,
  getEEAsset(){
    return ee.ImageCollection(this.assetPath.default);
  }
};
