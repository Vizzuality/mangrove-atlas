import { IDataAsset } from './EEDataset';
import ee from '@google/earthengine';

export interface IHansenDataAsset extends IDataAsset {
  numYears: number;
}

export const TreeHeightDataAsset: IHansenDataAsset = {
  assetPath: {
    default: "projects/mangrove-atlas-246414/assets/mangrove-properties/mangrove_canopy_height-v3"
  },
  numYears: 11,
  getEEAsset(){
    return ee.ImageCollection(this.assetPath.default);
  }
};
