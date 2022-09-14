import { takeLatest, put, call } from "redux-saga/effects";
import APIService from "services/api-service";
import { fetchRequested, fetchSucceeded, fetchFailed } from "./actions";

const service = new APIService();

function* getMangroveBlueCarbonData({ payload }) {
  yield put(fetchRequested());
  try {
    const mangroveData = yield call(
      service.fetchMangroveBlueCarbonData,
      payload
    );
    yield put(fetchSucceeded(mangroveData));
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
