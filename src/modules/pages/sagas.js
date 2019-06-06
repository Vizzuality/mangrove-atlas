import { takeLatest, put, select } from 'redux-saga/effects';
import { getLayers } from 'modules/layers/actions';

function* location() {
  const { layers } = yield select();
  const { list, isLoading } = layers;

  if (Object.keys(list).length === 0 && !isLoading) {
    yield put(getLayers());
  }
}

export default function* app() {
  yield takeLatest('LOCATION', location);
}
