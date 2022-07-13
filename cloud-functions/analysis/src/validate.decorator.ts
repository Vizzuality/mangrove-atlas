import {validate, ValidationError} from "class-validator";
import {plainToInstance} from "class-transformer";


// export const ValidateQuery = dto => validationFactory(Symbol("validate-query"), dto, "query");
// export const ValidateBody = dto => validationFactory(Symbol("validate-body"), dto, "body");

function transformValidationErrorsToJSON(errors: ValidationError[]) {
    return errors.reduce((p, c: ValidationError) => {
        if (!c.children || !c.children.length) {
            p[c.property] = Object.keys(c.constraints).map(key => c.constraints[key]);
        } else {
            p[c.property] = transformValidationErrorsToJSON(c.children);
        }
        return p;
    }, {});
}

