import { IDataAsset } from './EEDataset';
import ee from '@google/earthengine';

export interface ILossDataAsset extends IDataAsset {
  name: string;
}

export const LossDataAsset: ILossDataAsset = {
  assetPath: {
    default: "projects/mangrove-atlas-246414/assets/land-cover/mangrove_extent_loss-v3"
  },
  name: "loss",
  getEEAsset(){
    return ee.ImageCollection(this.assetPath.default);
  }
};
