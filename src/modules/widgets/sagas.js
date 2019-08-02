import { takeLatest, put } from 'redux-saga/effects';
import DATA from 'config/data.json';
import { fetchSucceeded, toggleActiveByLayerId } from './actions';

export function* toggleWidgetActive({ payload }) {
  yield put(toggleActiveByLayerId({ layerId: payload.id, isActive: payload.isActive }));
}

export function* getWidgets() {
  const { widgets } = DATA;

  yield put(fetchSucceeded(widgets));
}

export default function* widgetsSagas() {
  yield takeLatest('LAYERS/TOGGLE_ACTIVE', toggleWidgetActive);
  yield takeLatest('WIDGETS/FETCH_ALL', getWidgets);
}
