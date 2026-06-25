import { IDataAsset } from './EEDataset';
import ee from '@google/earthengine';

export const ExtentDataAsset: IDataAsset = {
  assetPath: {
    default: "projects/ee-petebunting-gmw/assets/gmw_v4112_mng_ext"
  },
  getEEAsset() {
    return ee.Image(this.assetPath.default);
  }
};
