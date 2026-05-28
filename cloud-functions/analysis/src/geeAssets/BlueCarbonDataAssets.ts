import { IDataAsset } from './EEDataset';
import ee from '@google/earthengine';

export interface IHansenDataAsset extends IDataAsset {
  numYears: number;
}

export const BlueCarbonDataAsset: IHansenDataAsset = {
  assetPath: {
    default: "projects/mangrove-atlas-246414/assets/mangrove-properties/mangrove_blue_carbon-v2_1"
  },
  numYears: 1,
  getEEAsset(){
    return ee.ImageCollection(this.assetPath.default);
  }
};
