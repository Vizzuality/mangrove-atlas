import { IDataAsset } from './EEDataset';
import ee from '@google/earthengine';

export interface ILossDataAsset extends IDataAsset {
  numYears: number;
}

export const LossDataAsset: ILossDataAsset = {
  assetPath: {
    default: "projects/global-mangrove-watch/land-cover/mangrove_extent_loss-v3"
  },
  numYears: 11,
  getEEAsset(){
    return ee.ImageCollection(this.assetPath.default);
  }
};
