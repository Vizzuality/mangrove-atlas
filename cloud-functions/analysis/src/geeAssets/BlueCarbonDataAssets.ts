import { IDataAsset } from './EEDataset';
import ee from '@google/earthengine';

export interface IHansenDataAsset extends IDataAsset {
  numYears: number;
}

export const BlueCarbonDataAsset: IHansenDataAsset = {
  assetPath: {
    default: "projects/global-mangrove-watch/mangrove-properties/mangrove_blue_carbon-v2_1/2016"
  },
  numYears: 1,
  getEEAsset(){
    return ee.ImageCollection(this.assetPath.default);
  }
};
