import { connect } from 'react-redux';

import { setWidgetCollapsed } from 'modules/dashboard/actions';
import { triggerMapAction } from 'modules/widgets/actions';
import Widget from './component';

const mapStateToProps = () => ({
});

const mapDispatchToProps = {
  onCollapseToggle: setWidgetCollapsed,
  onMapAction: triggerMapAction
};

export default connect(mapStateToProps, mapDispatchToProps)(Widget);
