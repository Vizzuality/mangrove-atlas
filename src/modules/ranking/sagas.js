import { takeLatest, put, call } from 'redux-saga/effects';
import APIService from 'services/api-service';
import { fetchRequested, fetchSucceeded, fetchFailed } from './actions';
import { fetchMangroveData } from '../mangrove-data/actions';

const service = new APIService();
function* getRankingData({ payload }) {
  yield put(fetchRequested());
  try {
    const rankingData = yield call(service.fetchRankingData, payload);
    yield put(fetchSucceeded(rankingData));
    const NetChangeData = rankingData.map(country => (service.fetchMangroveData, country.iso));
  } catch (err) {
    yield put(fetchFailed(err));
  }
}

export default function* mangroveRankingSagas() {
  yield takeLatest('RANKING/FETCH_ALL', getRankingData);
}
