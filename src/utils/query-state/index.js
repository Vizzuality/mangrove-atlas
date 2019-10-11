import { takeEvery, takeLatest, all, fork, put, select, throttle } from 'redux-saga/effects';
import get from 'lodash/get';
import { redirect } from 'redux-first-router';

import { setViewport } from 'modules/map/actions';
import { decodeUrlForState, encodeStateForUrl } from './stateToUrl';
import { ACTIONS } from './constants';

class QueryStateManager {
  /**
   * Saves the whole namespace object by name.
   */
  registry = new Map();

  /**
   * Save actions that trigger query encode and the namespace they refer to.
   */
  triggers = new Map();

  /**
   * Namespaces stores all registered namespaces
   * It is a set for having dedup, we only need to know
   * if an url query param is registered.
   */
  names = new Set();

  // These are encoding strategies, maybe we can add more later
  decode = decodeUrlForState;

  encode = encodeStateForUrl;

  /**
   * The inspector sniff through redux requests.
   */
  inspector = (dispatch, getState, { action }) => {
    // We make it an arrow function to have registry state available
    const { kind } = action.meta.location;

    if (kind && kind === 'load') {
      dispatch(ACTIONS.RESTORE_STATE());
    } else {
      // We assume it is put, so far it have worked
      dispatch(ACTIONS.STORE_STATE());
    }
  }

  /**
   * Add a namespace to the registry for act upon changes.
   * @param {string} namespace
   */
  add(namespace) {
    const { name } = namespace;
    const actions = get(namespace, 'encode.after', null);

    if (!actions || actions.length < 1) {
      // todo: Throw no-encoding-actions error
      return;
    }

    this.registry.set(name, namespace);
    this.names.add(name);

    actions.forEach((action) => {
      this.triggers.set(action().type, name);
    });
  }

  /**
   * This is for redux-sagas... using thunks should work pretty similar though.
   */
  * sagas() {
    const rules = Array.from(this.triggers.entries());

    const encodeRules = rules.map(([action, name]) => {
      const encodeRule = function* encodeRule() {
        const actionListener = function* actionListener() {
          const namespace = this.registry.get(name);
          const state = yield select();
          const { router } = state;

          yield put(redirect({ type: router.type,
            payload: {
              ...router.payload,
              query: {
                ...router.query,
                [name]: namespace.encode.selector(state)
              }
            } }));
        };

        if (action === setViewport().type) {
          yield throttle(1000, action, actionListener.bind(this));
        } else {
          yield takeLatest(action, actionListener.bind(this));
        }
      };

      return fork(encodeRule.bind(this));
    });

    const decodeRule = function* decodeRule() {
      function* sub() {
        const names = Array.from(this.names);
        const triggers = names.map((name) => {
          const { decode } = this.registry.get(name);

          if (decode && decode.trigger) {
            return fork(decode.trigger);
          }

          return null;
        });

        yield all(triggers.filter(trigger => Boolean(trigger)));
      }

      yield takeEvery(ACTIONS.RESTORE_STATE().type, sub.bind(this));
    };

    yield all([...encodeRules, fork(decodeRule.bind(this))]);
  }
}

const queryState = new QueryStateManager();

export default queryState;
export {
  QueryStateManager,
  queryState
};
