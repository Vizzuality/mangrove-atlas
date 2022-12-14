import { createAction } from "vizzuality-redux-tools";

export const setCurrent = createAction("DRAWING_TOOL/SET_CURRENT_MODE");
export const setDrawingValue = createAction("DRAWING_TOOL/SET_DRAWING_VALUE");
export const setDrawingMode = createAction("DRAWING_TOOL/SET_DRAWING_MODE");
export const setDrawingStatus = createAction("DRAWING_TOOL/SET_DRAWING_STATUS");
export const setCustomGeojsonFeatures = createAction("DRAWING_TOOL/SET_CUSTOM_GEOJSON_FEATURES");
