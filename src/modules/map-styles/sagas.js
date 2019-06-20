import { takeLatest, put, call } from 'redux-saga/effects';
import StyleService from 'services/style-service';
import { fetchRequested, fetchSucceeded, fetchFailed } from './actions';

const service = new StyleService({ entityName: 'layers' });

function* getMapStyles() {
  yield put(fetchRequested());
  try {
    const mapStyles = yield call(service.fetch, []);
    yield put(fetchSucceeded(mapStyles));
  } catch (err) {
    yield put(fetchFailed(err));
  }
}

export default function* mapStylesSagas() {
  yield takeLatest('MAP_STYLES/FETCH_ALL', getMapStyles);
}
