import { takeLatest, put, call } from 'redux-saga/effects';
import APIService from 'services/api-service';
import AnalysisService from 'services/analysis-service';
import { fetchRequested, fetchSucceeded, fetchFailed } from './actions';

const service = new APIService();

function* getMangroveHabitatExtentData({ payload }) {
  const locationId = payload?.location_id;
  yield put(fetchRequested());
  try {
    const mangroveHabitatExtentData = locationId === 'custom-area' ?
    yield call(AnalysisService.fetchMangroveCustomAreaAnalysisData, { geojson: payload.drawingValue, widgets: ['mangrove_extent'], location_id: 'custom-area' }) :
    yield call(service.fetchMangroveHabitatExtentData, payload);
    yield put(fetchSucceeded(mangroveHabitatExtentData));
  } catch (err) {
    yield put(fetchFailed(err));
  }
}


export default function* mangroveHabitatExtentSagas() {
  yield takeLatest('MANGROVE_HABITAT_EXTENT_DATA/FETCH_ALL', getMangroveHabitatExtentData);
}
