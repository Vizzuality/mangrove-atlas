import { IDataAsset } from './EEDataset';
import ee from '@google/earthengine';

export interface IGainDataAsset extends IDataAsset {
  numYears: number;
}

export const GainDataAsset: IGainDataAsset = {
  assetPath: {
    default: "projects/global-mangrove-watch/land-cover/mangrove_extent_gain-v3"
  },
  numYears: 11,
  getEEAsset(){
    return ee.ImageCollection(this.assetPath.default);
  }
};
