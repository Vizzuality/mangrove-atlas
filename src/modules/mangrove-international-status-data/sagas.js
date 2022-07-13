import { takeLatest, put, call } from "redux-saga/effects";
import APIService from "services/api-service";
import { fetchRequested, fetchSucceeded, fetchFailed } from "./actions";

const service = new APIService();

function* getInternationalStatusData({ payload }) {
  yield put(fetchRequested());
  try {
    const mangroveInternationalStatusData = yield call(
      service.fetchMangroveInternationalStatusData,
      payload
    );
    yield put(fetchSucceeded(mangroveInternationalStatusData));
  } catch (err) {
    yield put(fetchFailed(err));
  }
}

export default function* mangroveInternationalStatusSagas() {
  yield takeLatest(
    "MANGROVE_INTERNATIONAL_STATUS_DATA/FETCH_ALL",
    getInternationalStatusData
  );
}
