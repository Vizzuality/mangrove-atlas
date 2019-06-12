import { connect } from 'react-redux';

import {
  setWidgetCollapsed,
} from 'modules/dashboard/actions';
import Widget from './component';

const mapStateToProps = () => ({
});

const mapDispatchToProps = {
  onCollapseToggle: setWidgetCollapsed
  // onMapAction: triggerWidgetMapAction
};

export default connect(mapStateToProps, mapDispatchToProps)(Widget);
