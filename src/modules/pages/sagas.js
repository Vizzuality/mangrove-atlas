import { takeLatest, put, select } from 'redux-saga/effects';
import { getLayers } from 'modules/layers/actions';
import { setWidgets } from 'modules/dashboard/actions';

function* location() {
  const { page, layers, widgets: { list: allWidgets } } = yield select();
  const { payload: { type } } = page;
  const { list, isLoading } = layers;

  // First we load the layers, we could add some logic here.
  if (Object.keys(list).length === 0 && !isLoading) {
    yield put(getLayers());
  }

  // Then we load widgets
  // This could come from a service
  const DASHBOARD_WIDGETS = {
    global: [
      'widget_1',
      'widget_2',
      'widget_5'
    ],
    country: [
      'widget_1',
      'widget_2',
      'widget_3',
      'widget_4',
      'widget_5'
    ],
    protected_area: [
      'widget_1'
    ],
    aoi: [
      'widget_4',
      'widget_3',
      'widget_1'
    ]
  };

  // We expand them here to have some control over how they are displayed
  // todo: this should be part of the module, somehow
  const widgets = DASHBOARD_WIDGETS[type || 'global'].map(widget => ({
    id: widget,
    isCollapsed: true,
    isDisplayedOnMap: false,
    config: {
      layers: [
        // ...(allWidgets[widget].layers || [])
      ]
    }
  }));
  yield put(setWidgets(widgets));
}

export default function* pages() {
  yield takeLatest('LOCATION', location);
}
