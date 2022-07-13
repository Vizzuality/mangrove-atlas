import ee from '@google/earthengine';
export declare function eeAuthenticate(): Promise<void>;
export declare function eeEvaluate(eeStatement: ee.ComputedObject): Promise<any>;
export declare function arrSum(arr: []): number;
