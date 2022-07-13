"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// export const ValidateQuery = dto => validationFactory(Symbol("validate-query"), dto, "query");
// export const ValidateBody = dto => validationFactory(Symbol("validate-body"), dto, "body");
function transformValidationErrorsToJSON(errors) {
    return errors.reduce((p, c) => {
        if (!c.children || !c.children.length) {
            p[c.property] = Object.keys(c.constraints).map(key => c.constraints[key]);
        }
        else {
            p[c.property] = transformValidationErrorsToJSON(c.children);
        }
        return p;
    }, {});
}
//# sourceMappingURL=validate.decorator.js.map