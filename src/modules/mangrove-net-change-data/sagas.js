import { takeLatest, put, call } from 'redux-saga/effects';
import APIService from 'services/api-service';
import AnalysisService from 'services/analysis-service';
import { fetchRequested, fetchSucceeded, fetchFailed } from './actions';

const service = new APIService();

function* getMangroveNetChangeData({ payload }) {
  const locationId = payload?.location_id;
  yield put(fetchRequested());
  try {
    const mangroveNetChangeData = locationId === 'custom-area' ?
    yield call(AnalysisService.fetchMangroveCustomAreaAnalysisData, { geojson: payload.drawingValue, widgets: ['mangrove_net_change'], location_id: 'custom-area' }) :
    yield call(service.fetchMangroveNetChangeData, payload);
    yield put(fetchSucceeded(mangroveNetChangeData));
  } catch (err) {
    yield put(fetchFailed(err));
  }
}

export default function* mangroveNetChangeDataSagas() {
  yield takeLatest('MANGROVE_NET_CHANGE_DATA/FETCH_ALL', getMangroveNetChangeData);
}
