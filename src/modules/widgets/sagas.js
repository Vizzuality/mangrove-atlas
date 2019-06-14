import { takeLatest, put } from 'redux-saga/effects';

import { toggleWidgetLayers } from 'modules/dashboard/actions';

function* triggerMapAction({ payload }) {
  yield put(toggleWidgetLayers(payload));
}

export default function* widgetsSagas() {
  yield takeLatest('WIDGETS/triggerMapAction', triggerMapAction);
}
