import { takeLatest, put, call } from 'redux-saga/effects';
import APIService from 'services/api-service';
import { fetchRequested, fetchSucceeded, fetchFailed } from './actions';

const service = new APIService();

function* getMangroveDegradationAndLossData({ payload }) {
  yield put(fetchRequested());
  try {
    const mangroveDegradationAndLossData = yield call(service.fetchMangroveDegradationAndLossData, payload);
    yield put(fetchSucceeded(mangroveDegradationAndLossData));
  } catch (err) {
    yield put(fetchFailed(err));
  }
}

export default function* mangroveDegradationAndLossDataSagas() {
  yield takeLatest('MANGROVE_DEGRADATION_AND_LOSS_DATA/FETCH_ALL', getMangroveDegradationAndLossData);
}
