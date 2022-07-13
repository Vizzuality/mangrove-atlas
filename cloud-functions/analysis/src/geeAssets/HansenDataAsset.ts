import { IDataAsset } from './EEDataset';
import ee from '@google/earthengine';

export interface IHansenDataAsset extends IDataAsset {
  numYears: number;
}

export const HansenDataAsset: IHansenDataAsset = {
  assetPath: {
    default: "UMD/hansen/global_forest_change_2021_v1_9" },
  numYears: 20,
  getEEAsset(){
    return ee.Image(this.assetPath.default);
  }
};
