import { IDataAsset } from './EEDataset';
import ee from '@google/earthengine';

export interface ILossDataAsset extends IDataAsset {
  name: string;
}

export const LossDataAsset: ILossDataAsset = {
  assetPath: {
    default: "projects/global-mangrove-watch/land-cover/mangrove_extent_loss-v3"
  },
  name: "loss",
  getEEAsset(){
    return ee.ImageCollection(this.assetPath.default);
  }
};
