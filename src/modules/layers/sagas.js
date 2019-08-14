import { takeLatest, put } from 'redux-saga/effects';
import DATA from 'config/data.json';
import { fetchSucceeded, toggleActive } from './actions';

export function* toggleActiveLayer({ payload }) {
  yield put(toggleActive({ id: payload.layerId, isActive: payload.isActive }));
}

function* getLayers() {
  const { layers } = DATA;
  yield put(fetchSucceeded(layers));
}

export default function* layersSagas() {
  yield takeLatest('WIDGET/TOGGLE_ACTIVE', toggleActiveLayer);
  yield takeLatest('LAYERS/FETCH_ALL', getLayers);
}
