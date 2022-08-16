import { takeLatest, put, call } from 'redux-saga/effects';
import APIService from 'services/api-service';
import { fetchRequested, fetchSucceeded, fetchFailed } from './actions';

const service = new APIService();

function* getMangroveNetChangeData({ payload }) {
  yield put(fetchRequested());
  try {
    const mangroveNetChangeData = yield call(service.fetchMangroveNetChangeData, payload);
    yield put(fetchSucceeded(mangroveNetChangeData));
  } catch (err) {
    yield put(fetchFailed(err));
  }
}

export default function* mangroveNetChangeDataSagas() {
  yield takeLatest('MANGROVE_NET_CHANGE_DATA/FETCH_ALL', getMangroveNetChangeData);
}
