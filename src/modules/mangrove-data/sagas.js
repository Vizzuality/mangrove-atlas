import { takeLatest, put, call } from 'redux-saga/effects';
import APIService from 'services/api-service';
import { fetchRequested, fetchSucceeded, fetchFailed } from './actions';

const service = new APIService();

function* getMangroveData({ payload }) {
  yield put(fetchRequested());
  try {
    const mangroveData = yield call(service.fetchMangroveData, payload);
    yield put(fetchSucceeded(mangroveData));
  } catch (err) {
    yield put(fetchFailed(err));
  }
}

export default function* mangroveDataSagas() {
  yield takeLatest('MANGROVE_DATA/FETCH_ALL', getMangroveData);
  yield takeLatest('LOCATIONS/SET_CURRENT', getMangroveData);
}
