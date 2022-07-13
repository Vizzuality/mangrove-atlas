"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyze = void 0;
const earthengine_1 = __importDefault(require("@google/earthengine"));
const utils_1 = require("./utils");
const BlueCarbon_1 = require("./calculations/BlueCarbon");
var Widgets;
(function (Widgets) {
    Widgets["alpha"] = "a";
    Widgets["beta"] = "b";
    Widgets["gamma"] = "g";
})(Widgets || (Widgets = {}));
async function analyze(req, res) {
    res.set('Access-Control-Allow-Origin', '*');
    const isValid = validate(req, res);
    if (!isValid.status) {
        return isValid.res;
    }
    if (req.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        return res.status(204).send('');
    }
    try {
        await (0, utils_1.eeAuthenticate)();
        const geometryCollection = earthengine_1.default.FeatureCollection(req.body.geometry);
        const computedObject = BlueCarbon_1.BlueCarbonCalculations.calculateTotalTreeCover(geometryCollection);
        const result = await (0, utils_1.eeEvaluate)(computedObject);
        res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ "error": error.message });
    }
    return res;
}
exports.analyze = analyze;
function isValidAnalysisRequestBody(obj) {
    return obj.geometry;
}
function isValidAnalysisRequestParams(obj) {
    return obj.widgets;
}
function validate(req, res) {
    console.log(req.query);
    if (!req.body || !req.query) {
        return { "status": false,
            "res": res.status(400).json({ "error": "No data provided" }) };
    }
    if (!isValidAnalysisRequestBody(req.body)) {
        return { "status": false,
            "res": res.status(400).json({ "error": "geometry is required as part of the body" }) };
    }
    if (!isValidAnalysisRequestParams(req.query)) {
        return { "status": false,
            "res": res.status(400).json({ "error": "a valid widget param is required" }) };
    }
    return { "status": true, "res": res };
}
//# sourceMappingURL=index.js.map