import { takeLatest, put, call } from 'redux-saga/effects';
import APIService from 'services/api-service';
import { fetchRequested, fetchSucceeded, fetchFailed } from './actions';

const service = new APIService();

function* getMangroveEmissionsMitigationData({ payload }) {
  yield put(fetchRequested());
  try {
    const mangroveEmissionsMitigationData = yield call(service.fetchMangroveEmissionsMitigationData, payload);
    yield put(fetchSucceeded(mangroveEmissionsMitigationData));
  } catch (err) {
    yield put(fetchFailed(err));
  }
}

export default function* mangroveDegradationAndLossDataSagas() {
  yield takeLatest('MANGROVE_EMISSIONS_MITIGATION_DATA/FETCH_ALL', getMangroveEmissionsMitigationData);
}
