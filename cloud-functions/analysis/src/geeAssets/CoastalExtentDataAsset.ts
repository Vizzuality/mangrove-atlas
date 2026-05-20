import { IDataAsset } from './EEDataset';
import ee from '@google/earthengine';

export interface IExtentDataAsset extends IDataAsset {
  numYears: number;
}

export const CoastalExtentDataAsset: IExtentDataAsset = {
  assetPath: {
    default: "projects/mangrove-atlas-246414/assets/physical-environment/coastlines-v3"
  },
  numYears: 11,
  getEEAsset(){
    return ee.FeatureCollection(this.assetPath.default);
  }
};
