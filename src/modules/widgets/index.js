import { fetchSucceeded } from 'modules/layers/actions';
import queryState from 'utils/query-state';
import * as actions from './actions';
import * as reducers from './reducers';
import sagas, { restoreWidgetsState } from './sagas';
import initialState from './initial-state';


/**
 * queryState.add register the namespace for url to state actions.
 * The name property will become the query param.
 * It is suppossed to be semantic:
 *
 * For namespace 'map'
 * encode selector
 * after any of these actions are triggered.
 *
 * For namespace 'map'
 * decode trigger
 * after all of these actions have happened.
*/
queryState.add({
  name: 'widgets',
  encode: {
    after: [
      actions.expandAll,
      actions.collapseAll,
      actions.toggleCollapse,
      actions.toggleActive,
      actions.toggleActiveByLayerId
    ],
    selector: (state) => {
      const { widgets: { list } } = state;
      const serializedList = list.map(widget => ({
        id: widget.slug,
        isCollapsed: widget.isCollapsed || false,
        isActive: widget.isActive || false
      }));

      return serializedList.reduce((acc, widget) => ({
        ...acc,
        [widget.id]: {
          isCollapsed: widget.isCollapsed,
          isActive: widget.isActive
        }
      }), {});
    }
  },
  decode: {
    after: [
      fetchSucceeded
    ],
    trigger: restoreWidgetsState
  }
});

export { actions, initialState, reducers, sagas };
