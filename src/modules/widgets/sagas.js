import { takeLatest, put, call } from 'redux-saga/effects';
// import { toggleWidgetLayers } from 'modules/dashboard/actions';
import DatasetService from 'services/dataset-service';
import { fetchRequested, fetchSucceeded, fetchFailed } from './actions';

const service = new DatasetService({ entityName: 'widgets' });

// function* triggerMapAction({ payload }) {
//   yield put(toggleWidgetLayers(payload));
// }

// export default function* widgetsSagas() {
//   yield takeLatest('WIDGETS/triggerMapAction', triggerMapAction);
// }

export function* getWidgets() {
  yield put(fetchRequested());
  try {
    const layers = yield call(service.fetch, []);
    yield put(fetchSucceeded(layers));
  } catch (err) {
    yield put(fetchFailed(err));
  }
}

export default function* widgetsSagas() {
  yield takeLatest('WIDGETS/FETCH_ALL', getWidgets);
}
