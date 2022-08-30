import { takeLatest, put, call } from "redux-saga/effects";
import APIService from "services/api-service";
import AnalysisService from 'services/analysis-service';

import { fetchRequested, fetchSucceeded, fetchFailed } from "./actions";

const service = new APIService();

function* getMangroveBiomassData({ payload }) {
  const locationId = payload?.location_id;
  yield put(fetchRequested());
  try {
    const mangroveBiomassData =
      locationId === "custom-area"
        ? yield call(AnalysisService.fetchMangroveCustomAreaAnalysisData, {
            geojson: payload.drawingValue,
            widgets: ["mangrove_biomass"],
            location_id: "custom-area",
          })
        : yield call(service.fetchmangroveBiomassData, payload);
    yield put(fetchSucceeded(mangroveBiomassData));
  } catch (err) {
    yield put(fetchFailed(err));
  }
}

export default function* mangroveBiomassDataSagas() {
  yield takeLatest("MANGROVE_BIOMASS_DATA/FETCH_ALL", getMangroveBiomassData);
}
