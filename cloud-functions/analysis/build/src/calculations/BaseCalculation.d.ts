export declare abstract class BaseCalculation {
    constructor();
}
/** calculationIds is a object containing an array of all calculations under each class  */
export declare const calculationIds: {
    [classId: string]: string[];
};
/** calculationClasses contains references between calculation id's and their class  */
export declare const calculationClasses: {
    [classId: string]: BaseCalculation;
};
