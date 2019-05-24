import Registry from './registry';

class QueryStateManager {
  registry = new Registry()

  routerActions = [];

  config({ routerActions }) {
    if (routerActions) {
      this.routerActions.push(...routerActions);
    }
  }

  hasQuery = (state, namespace) => Boolean(state[namespace].query);

  isRouterAction(actionType) {
    // pageActions could be here but there is no need to repeat each time this is run
    return this.routerActions.includes(actionType);
  }

  middleware = store => next => (action) => {
    const state = store.getState();
    const { modules } = this.registry;
    const routerNamespace = 'router';

    Array.from(modules).forEach(([namespace, module]) => {
      const { query: currentQuery } = state[routerNamespace];
      const namespaceState = state[namespace];

      // On changes encode the state as url
      if (module.actions.map(moduleAction => moduleAction.toString()).includes(action.type)) {
        const namespaceQuery = module.encodeMap(namespaceState);

        const query = currentQuery
          ? {
            ...currentQuery,
            [namespace]: { ...namespaceQuery }
          }
          : {
            [namespace]: namespaceQuery
          };

        const enhancedRoute = {
          type: state[routerNamespace].type,
          payload: state[routerNamespace].payload,
          query
        };

        store.dispatch(enhancedRoute);
      }

      // On route decode the query to state
      // This should be run whenever the action is part of router actions
      // WE ARE CHANGING APP STATE HERE BE CAREFUL!!
      if (this.isRouterAction(action.type) && this.hasQuery(state, routerNamespace)) {
        if (currentQuery[namespace]) {
          const restoredState = module.decodeMap(currentQuery[namespace]);
          state[namespace] = {
            ...namespaceState,
            ...restoredState
          };
        }
      }
    });


    return next(action);
  }
}

const queryState = new QueryStateManager();

export {
  QueryStateManager,
  queryState
};
