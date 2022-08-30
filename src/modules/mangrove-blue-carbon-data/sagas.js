import { takeLatest, put, call } from "redux-saga/effects";
import APIService from "services/api-service";
import AnalysisService from 'services/analysis-service';

import { fetchRequested, fetchSucceeded, fetchFailed } from "./actions";

const service = new APIService();

function* getMangroveBlueCarbonData({ payload }) {
  const locationId = payload?.location_id;
  yield put(fetchRequested());
  try {
    const mangroveBlueCarbonDataData =
      locationId === "custom-area"
        ? yield call(AnalysisService.fetchMangroveCustomAreaAnalysisData, {
            geojson: payload.drawingValue,
            widgets: ["mangrove_blue_carbon"],
            location_id: "custom-area",
          })
        : yield call(service.fetchMangroveBlueCarbonData, payload);
    yield put(fetchSucceeded(mangroveBlueCarbonDataData));
  } catch (err) {
    yield put(fetchFailed(err));
  }
}

export default function* mangroveBlueCarbonDataSagas() {
  yield takeLatest(
    "MANGROVE_BLUE_CARBON_DATA/FETCH_ALL",
    getMangroveBlueCarbonData
  );
}
