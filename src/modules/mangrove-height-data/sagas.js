import { takeLatest, put, call } from 'redux-saga/effects';
import APIService from 'services/api-service';
import AnalysisService from 'services/analysis-service';
import { fetchRequested, fetchSucceeded, fetchFailed } from './actions';

const service = new APIService();

function* getMangroveHeightData({ payload }) {
  const locationId = payload?.location_id;
  yield put(fetchRequested());
  try {
    const mangroveHeightData = locationId === 'custom-area' ?
    yield call(AnalysisService.fetchMangroveCustomAreaAnalysisData, { geojson: payload.drawingValue, widgets: ['mangrove_height'], location_id: 'custom-area' }) :
    yield call(service.fetchMangroveHeightData, payload);
    yield put(fetchSucceeded(mangroveHeightData));
  } catch (err) {
    yield put(fetchFailed(err));
  }
}

export default function* mangroveHeightDataSagas() {
  yield takeLatest('MANGROVE_HEIGHT_DATA/FETCH_ALL', getMangroveHeightData);
}
