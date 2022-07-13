"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlueCarbonCalculations = void 0;
const earthengine_1 = __importDefault(require("@google/earthengine"));
const HansenDataAsset_1 = require("../geeAssets/HansenDataAsset");
const BaseCalculation_1 = require("./BaseCalculation");
class BlueCarbonCalculationsClass extends BaseCalculation_1.BaseCalculation {
    constructor() {
        super(...arguments);
        this.dataAsset = HansenDataAsset_1.HansenDataAsset;
    }
    calculateTotalTreeCover(collection) {
        const image = this.dataAsset.getEEAsset();
        console.log(`start calculating total tree cover`);
        const reducers = earthengine_1.default.Reducer.histogram(20)
            .combine(earthengine_1.default.Reducer.minMax(), '', true)
            .combine(earthengine_1.default.Reducer.mean(), '', true)
            .combine(earthengine_1.default.Reducer.stdDev(), '', true)
            .combine(earthengine_1.default.Reducer.sum(), '', true);
        const regReducer = {
            collection: collection,
            reducer: reducers
        };
        console.log(`ongoing...`);
        return image.reduceRegions(regReducer).toList(10000);
    }
}
exports.BlueCarbonCalculations = new BlueCarbonCalculationsClass();
//# sourceMappingURL=BlueCarbon.js.map