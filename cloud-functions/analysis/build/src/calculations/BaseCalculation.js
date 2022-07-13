"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculationClasses = exports.calculationIds = exports.BaseCalculation = void 0;
class BaseCalculation {
    constructor() {
        // Register the class as a calculation class
        exports.calculationClasses[_getClassId(this)] = this;
    }
}
exports.BaseCalculation = BaseCalculation;
/** calculationIds is a object containing an array of all calculations under each class  */
exports.calculationIds = {};
/** calculationClasses contains references between calculation id's and their class  */
exports.calculationClasses = {};
/** calculationTypes contains a reference of all calculations types and their id */
/** Get identifier for a calculation class */
function _getClassId(c) {
    const className = c.constructor.name;
    if (!className.endsWith('CalculationsClass')) {
        throw new Error(`Calculation class ${className} should end with CalculationsClass`);
    }
    return className.replace('CalculationsClass', '');
}
//# sourceMappingURL=BaseCalculation.js.map