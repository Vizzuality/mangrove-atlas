import { takeLatest, put, call } from 'redux-saga/effects';
import { setList, setLoading, setError } from 'modules/layers/actions';
import datasetService from 'services/dataset-service';

function* getLayers() {
  yield put(setLoading(true));
  yield put(setError(null));

  const datasets = {
    // baseline datasets
    // annual: '529e614f-9192-43a5-a890-ce1dc3630aa6',
    // monthly: 'bd965bd5-9568-4637-a873-2872f39c4803',
    // non-baseline datasets
    // projected: '17f3b259-b3b9-4bd6-910d-852fb3c1c510',
    // presets
    // weights: 'dee362f5-6631-46b2-a8e3-bdd05d5605ce',
    // custom: 'cbe7cee3-b44b-4e56-8233-9111b4076fe0',
    hydrobasins: '57de0a79-caaa-4caa-bcfd-a1faff7103b8',
    aquifers: 'f239298f-25a1-430d-9723-f0a853b81184'
  };

  try {
    const layers = yield call(datasetService.fetchDatasetsLayers, datasets);
    yield put(setList(layers));
  } catch (err) {
    yield put(setError(err));
  } finally {
    yield put(setLoading(false));
  }
}

export default function* layersSagas() {
  yield takeLatest('LAYERS/getLayers', getLayers);
}
