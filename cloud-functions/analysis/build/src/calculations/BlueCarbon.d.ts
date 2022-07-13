import ee from '@google/earthengine';
import { BaseCalculation } from './BaseCalculation';
declare class BlueCarbonCalculationsClass extends BaseCalculation {
    dataAsset: import("../geeAssets/HansenDataAsset").IHansenDataAsset;
    calculateTotalTreeCover(collection: ee.FeatureCollection): ee.List;
}
export declare const BlueCarbonCalculations: BlueCarbonCalculationsClass;
export {};
