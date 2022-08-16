import { takeLatest, put, call } from 'redux-saga/effects';
import APIService from 'services/api-service';
import { fetchRequested, fetchSucceeded, fetchFailed } from './actions';

const service = new APIService();

function* getMangroveHabitatExtentData({ payload }) {
  yield put(fetchRequested());
  try {
    const mangroveHabitatExtentData = yield call(service.fetchMangroveHabitatExtentData, payload);
    yield put(fetchSucceeded(mangroveHabitatExtentData));
  } catch (err) {
    yield put(fetchFailed(err));
  }
}

export default function* mangroveHabitatExtentSagas() {
  yield takeLatest('MANGROVE_HABITAT_EXTENT_DATA/FETCH_ALL', getMangroveHabitatExtentData);
}
