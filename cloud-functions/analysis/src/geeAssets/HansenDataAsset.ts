import { IDataAsset } from './EEDataset';
import ee from '@google/earthengine';

export interface IHansenDataAsset extends IDataAsset {
  numYears: number;
}

export const HansenDataAsset: IHansenDataAsset = {
  assetPath: { default: "UMD/hansen/global_forest_change_2021_v1_9" },
  versionCode: '1.8',
  numYears: 20,
  citation:
    'Hansen, M.C., Potapov, P.V., Moore, R., Hancher, M., Turubanova, S.A., Tyukavina, A., \
    Thau, D., Stehman, S.V., Goetz, S.J., Loveland, T.R., Kommareddy, A., Egorov, A., Chini, L.,\
    Justice, C.O., and Townshend, J.R.G., 2013, High-Resolution Global Maps of 21st-Century Forest \
    Cover Change: Science, v. 342, no. 6160, p. 850-853',
  sourceName: 'Hansen et al (2013)',
  sourceUrl: 'https://science.sciencemag.org/content/342/6160/850.abstract',
  getEEAsset(): ee.Image {
    console.log(this.assetPath.default);
    // return new ee.Image(this.assetPath.default);
    return new ee.Image("UMD/hansen/global_forest_change_2021_v1_9");
  }
};
