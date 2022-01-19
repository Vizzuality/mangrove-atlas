import { takeLatest, put, call } from 'redux-saga/effects';
import AlertsService from 'services/alerts-service';
import { fetchRequested, fetchSucceeded, fetchFailed } from './actions';

const service = new AlertsService();
function* getAlerts({ payload }) {
  yield put(fetchRequested());
  try {
    const alertsData = yield call(service.fetchAlerts, payload);
    yield put(fetchSucceeded(alertsData));
  } catch (err) {
    yield put(fetchFailed(err));
  }
}

export default function* mangroveAlertsSagas() {
  yield takeLatest('ALERTS/FETCH_ALL', getAlerts);
}
