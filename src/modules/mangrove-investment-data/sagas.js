import { takeLatest, put, call } from "redux-saga/effects";
import APIService from "services/api-service";
import { fetchRequested, fetchSucceeded, fetchFailed } from "./actions";

const service = new APIService();

function* getInvestmentPotentialData({ payload }) {
  yield put(fetchRequested());
  try {
    const mangroveInvestmentPotentialData = yield call(
      service.fetchInvestmentPotentialData,
      payload
    );
    yield put(fetchSucceeded(mangroveInvestmentPotentialData));
  } catch (err) {
    yield put(fetchFailed(err));
  }
}

export default function* mangroveInvestmentPotentialSagas() {
  yield takeLatest(
    "MANGROVE_INVESTMENT_POTENTIAL_DATA/FETCH_ALL",
    getInvestmentPotentialData
  );
}
