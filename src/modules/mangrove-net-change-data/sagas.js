import { takeLatest, put, call } from 'redux-saga/effects';
import APIService from 'services/api-service';
import { fetchRequested, fetchSucceeded, fetchFailed } from './actions';

const service = new APIService();

function* getMangroveNetChnageData({ payload }) {
  yield put(fetchRequested());
  try {
    const mangroveNetChnageData = yield call(service.fetchMangroveNetChnageData, payload);
    yield put(fetchSucceeded(mangroveNetChnageData));
  } catch (err) {
    yield put(fetchFailed(err));
  }
}

export default function* mangroveNetChnageDataSagas() {
  yield takeLatest('MANGROVE_NET_CHANGE_DATA/FETCH_ALL', getMangroveNetChnageData);
}
