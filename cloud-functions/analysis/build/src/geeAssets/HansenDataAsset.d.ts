import { IDataAsset } from './EEDataset';
export interface IHansenDataAsset extends IDataAsset {
    numYears: number;
}
export declare const HansenDataAsset: IHansenDataAsset;
