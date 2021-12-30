import { takeLatest, put, call } from 'redux-saga/effects';
import APIService from 'services/api-service';
import { fetchRequested, fetchSucceeded, fetchFailed } from './actions';

const service = new APIService();

function* getMangroveProtectionData({ payload }) {
  yield put(fetchRequested());
  try {
    const mangroveProtectionData = yield call(service.fetchMangroveProtectionData, payload);
    yield put(fetchSucceeded(mangroveProtectionData));
  } catch (err) {
    yield put(fetchFailed(err));
  }
}

export default function* mangroveProtectionDataSagas() {
  yield takeLatest('MANGROVE_PROTECTION_DATA/FETCH_ALL', getMangroveProtectionData);
}
