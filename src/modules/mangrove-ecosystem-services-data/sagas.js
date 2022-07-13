import { takeLatest, put, call } from 'redux-saga/effects';
import APIService from 'services/api-service';
import { fetchRequested, fetchSucceeded, fetchFailed } from './actions';

const service = new APIService();

function* getMangroveEcosystemServicesData({ payload }) {
  yield put(fetchRequested());
  try {
    const mangroveEcosystemServicesData = yield call(service.fetchMangroveEcosystemServicesData, payload);
    yield put(fetchSucceeded(mangroveEcosystemServicesData));
  } catch (err) {
    yield put(fetchFailed(err));
  }
}

export default function* mangroveEcosystemServicesSagas() {
  yield takeLatest('MANGROVE_ECOSYSTEM_SERVICES_DATA/FETCH_ALL', getMangroveEcosystemServicesData);
}
