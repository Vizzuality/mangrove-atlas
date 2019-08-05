import { takeLatest, put, call } from 'redux-saga/effects';
import { fetchRequested, fetchSucceeded, fetchFailed } from './actions';

const getAllLanguages = () => {
  const { Transifex } = window;

  return new Promise((resolve, reject) => {
    Transifex.live.onError(err => reject(err));
    Transifex.live.onFetchLanguages(languages => resolve(languages));
    Transifex.live.getAllLanguages();
  })
};

function* getLanguages() {
  yield put(fetchRequested());
  try {
    const languages = yield call(getAllLanguages);
    yield put(fetchSucceeded(languages));
  } catch (err) {
    yield put(fetchFailed(err));
  }
}

export default function* languagesSagas() {
  yield takeLatest('LANGUAGES/GET_ALL', getLanguages);
}
