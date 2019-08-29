import { takeLatest, put, select } from 'redux-saga/effects';
import DATA from 'config/data.json';
import { fetchSucceeded, toggleActive } from './actions';
import { activeWidgets as _activeWidgets } from 'modules/widgets/selectors';

export function* toggleActiveLayer({ payload }) {
  yield put(toggleActive({ id: payload.layerId, isActive: payload.isActive }));
}

function* getLayers() {
  /**
   * Widgets load first and contain layers to be loaded
   * See 'modules/app/sagas.js'
   * 
   * Since both are static (there is no request for now), it makes sense
   * to have this code here to get the list of active layers and activate them.
   * TODO: For async retrieval this would trigger some request and the
   * rehydratation of layers should happen on a fetchSucceeded handler.
   */
  const activeWidgets = yield select(_activeWidgets);
  const { layers } = DATA;
  const activeLayers = activeWidgets.map(w => w.layersIds).flat();
  const updatedLayers = layers.map(l => {
    const newLayer = Object.assign({}, l);

    if (activeLayers.includes(l.id)) {
      newLayer.isActive = true;
    }

    return newLayer;
  });
  yield put(fetchSucceeded(updatedLayers));
}

export default function* layersSagas() {
  yield takeLatest('WIDGET/TOGGLE_ACTIVE', toggleActiveLayer);
  yield takeLatest('LAYERS/FETCH_ALL', getLayers);
}
