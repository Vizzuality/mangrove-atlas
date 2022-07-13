"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serialize = void 0;
const utils_1 = require("./utils");
function serialize(originalData) {
    if (!originalData || !originalData.length)
        return null;
    const props = originalData[0].properties;
    const data = props.histogram;
    const bucketWidth = data.bucketWidth;
    const countSum = (0, utils_1.arrSum)(data.histogram);
    return {
        rows: data.histogram.map((d, i) => ({
            min: data.bucketMin + (bucketWidth * i),
            max: data.bucketMin + (bucketWidth * (i + 1)),
            count: d,
            percent: d / countSum
        })),
        fields: {
            min: { type: 'number' },
            max: { type: 'number' },
            count: { type: 'number' },
            percent: { type: 'number' }
        },
        total_rows: data.histogram.length,
        stats: {
            min: props.min,
            max: props.max,
            mean: props.mean,
            stdev: props.stdDev,
            sum: props.sum
        }
    };
}
exports.serialize = serialize;
;
//# sourceMappingURL=serialize.js.map