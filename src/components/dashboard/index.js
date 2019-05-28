import { connect } from 'react-redux';
import {
  setWidgetsCollapsed,
  setSearchActive,
  setDashboardCollapsed
} from 'modules/app/actions';

import Dashboard from './component';
import { TITLES, WIDGETS } from './constants';

// todo: widgets are processed here so content can get customized
const mapStateToProps = (state, { type, id }) => {
  const acceptedTypes = ['global', 'country', 'aoi', 'protected_area'];

  // Check location type
  if (!acceptedTypes.includes(type)) {
    // todo: decide how to handle error
    throw new Error('Not a valid type.');
  }

  const mappedTitle = TITLES[type];
  const title = (typeof mappedTitle === 'string') ? mappedTitle : mappedTitle(id);

  // Check title
  if (!title) {
    // todo: decide how to handle error
    throw new Error('Not a valid title.');
  }

  const widgets = WIDGETS[type];

  return ({
    title,
    widgets,
    ...state.app
  });
};

const mapDispatchToProps = {
  setWidgetsCollapsed,
  setSearchActive,
  setDashboardCollapsed
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
