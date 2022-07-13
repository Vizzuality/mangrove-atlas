"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrSum = exports.eeEvaluate = exports.eeAuthenticate = void 0;
const earthengine_1 = __importDefault(require("@google/earthengine"));
const PRIVATE_KEY = __importStar(require("./credentials.json"));
function eeAuthenticate() {
    return new Promise((resolve, reject) => {
        // Authenticate to service account using short living access tokens
        earthengine_1.default.data.authenticateViaPrivateKey(PRIVATE_KEY, () => earthengine_1.default.initialize(null, null, resolve, reject), (error) => {
            console.error(error);
        });
    });
}
exports.eeAuthenticate = eeAuthenticate;
function eeEvaluate(eeStatement) {
    return new Promise((resolve, reject) => {
        eeStatement.evaluate((success, failure) => {
            if (failure)
                reject(new Error(failure));
            resolve(success);
        });
    });
}
exports.eeEvaluate = eeEvaluate;
function arrSum(arr) {
    return arr.reduce((a, b) => a + b, 0);
}
exports.arrSum = arrSum;
;
//# sourceMappingURL=utils.js.map