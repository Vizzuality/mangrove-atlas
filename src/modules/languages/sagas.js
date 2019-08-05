import { put, takeLatest } from 'redux-saga/effects';
import { fetchLanguages } from './actions';


function* getLanguages() {
  yield put(fetchLanguages());
}

export default function* languagesSagas() {
  yield takeLatest('FETCH_LANGUAGES', getLanguages);
}
