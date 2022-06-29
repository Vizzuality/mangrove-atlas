export abstract class BaseCalculation {
  constructor() {
    // Register the class as a calculation class
    calculationClasses[_getClassId(this)] = this;
  }
}

/** calculationIds is a object containing an array of all calculations under each class  */
export const calculationIds: { [classId: string]: string[] } = {};
/** calculationClasses contains references between calculation id's and their class  */
export const calculationClasses: { [classId: string]: BaseCalculation } = {};
/** calculationTypes contains a reference of all calculations types and their id */

/** Get identifier for a calculation class */
function _getClassId(c: BaseCalculation): string {
  const className = c.constructor.name;
  if (!className.endsWith('CalculationsClass')) {
    throw new Error(`Calculation class ${className} should end with CalculationsClass`);
  }
  return className.replace('CalculationsClass', '');
}

