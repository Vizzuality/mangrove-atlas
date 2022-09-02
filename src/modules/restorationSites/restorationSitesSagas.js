import { takeLatest, put, call } from 'redux-saga/effects';
import RestorationSitesService from 'services/restoration-sites-service';
import { fetchRequested, fetchSucceeded, fetchFailed } from './restorationSitesActions';

const service = new RestorationSitesService();
function* getSites({ payload }) {
  yield put(fetchRequested());
  try {
    const sitesData = yield call([service, service.fetchSites], payload);
    yield put(fetchSucceeded(sitesData));
  } catch (err) {
    yield put(fetchFailed(err));
  }
}

export default function* mangroveRestorationSitesSagas() {
  yield takeLatest('RESTORATION_SITES/FETCH_ALL', getSites);
}
