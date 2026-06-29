import { IDataAsset } from './EEDataset';
import ee from '@google/earthengine';

export interface IChangeDataAsset extends IDataAsset {
  name: string;
}

export const ChangeDataAsset: IChangeDataAsset = {
  assetPath: {
    default: 'projects/mangrove-atlas-246414/assets/land-cover/mangrove_change_ic_v4',
  },
  name: 'change',
  getEEAsset() {
    return ee.ImageCollection(this.assetPath.default);
  },
};
