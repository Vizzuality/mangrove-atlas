import { takeLatest, put, call } from 'redux-saga/effects';
import AlertsService from 'services/alerts-service';

import { fetchRequested, fetchSucceeded, fetchFailed } from './actions';

function* getAlerts({ payload }) {
  const locationId = payload?.location_id;
  const { drawingValue, ...params } = payload;
  yield put(fetchRequested());
  try {
    const alertsData = locationId === 'custom-area' ?
    yield call(AlertsService.fetchMangroveCustomAreaAnalysisData, { geojson: payload.drawingValue, ...params }) : 
    yield call(AlertsService.fetchAlerts, payload);
    yield put(fetchSucceeded(alertsData));
  } catch (err) {
    yield put(fetchFailed(err));
  }
}

export default function* mangroveAlertsSagas() {
  yield takeLatest('ALERTS/FETCH_ALL', getAlerts);
}
