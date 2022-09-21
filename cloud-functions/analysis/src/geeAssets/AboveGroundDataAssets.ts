import { IDataAsset } from './EEDataset';
import ee from '@google/earthengine';

export interface IHansenDataAsset extends IDataAsset {
  numYears: number;
}

export const HansenDataAsset: IHansenDataAsset = {
  assetPath: {
    default: "projects/global-mangrove-watch/mangrove-properties/mangrove_aboveground_biomass-v3"
  },
  numYears: 20,
  getEEAsset(){
    return ee.ImageCollection(this.assetPath.default);
  }
};
