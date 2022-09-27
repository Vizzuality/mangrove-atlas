import { IDataAsset } from './EEDataset';
import ee from '@google/earthengine';

export interface IGainDataAsset extends IDataAsset {
  name: string;
}

export const GainDataAsset: IGainDataAsset = {
  assetPath: {
    default: "projects/global-mangrove-watch/land-cover/mangrove_extent_gain-v3"
  },
  name: "gain",
  getEEAsset(){
    return ee.ImageCollection(this.assetPath.default);
  }
};
