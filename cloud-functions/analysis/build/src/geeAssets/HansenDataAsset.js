"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HansenDataAsset = void 0;
const earthengine_1 = __importDefault(require("@google/earthengine"));
exports.HansenDataAsset = {
    assetPath: {
        default: "UMD/hansen/global_forest_change_2021_v1_9"
    },
    numYears: 20,
    getEEAsset() {
        return earthengine_1.default.Image(this.assetPath.default);
    }
};
//# sourceMappingURL=HansenDataAsset.js.map