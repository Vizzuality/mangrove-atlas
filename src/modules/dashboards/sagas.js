import { takeLatest, put } from 'redux-saga/effects';
import DATA from 'config/data.json';
import { fetchSucceeded } from './actions';

function* getDashboards() {
  const { dashboards } = DATA;
  yield put(fetchSucceeded(dashboards));
}

export default function* dashboardsSagas() {
  yield takeLatest('DASHBOARDS/FETCH_ALL', getDashboards);
}
