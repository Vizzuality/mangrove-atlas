import { IDataAsset } from './EEDataset';
import ee from '@google/earthengine';

export interface IHansenDataAsset extends IDataAsset {
  numYears: number;
}

export const AbovegroundBiomassDataAsset: IHansenDataAsset = {
  assetPath: {
    default: "projects/mangrove-atlas-246414/assets/mangrove-properties/mangrove_aboveground_biomass-v3"
  },
  numYears: 20,
  getEEAsset(){
    return ee.ImageCollection(this.assetPath.default);
  }
};
