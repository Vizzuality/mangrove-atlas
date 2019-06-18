import { connect } from 'react-redux';

import { toggleCollapse, triggerMapAction } from 'modules/widgets/actions';
import Widget from './component';

const mapStateToProps = () => ({
});

const mapDispatchToProps = {
  toggleCollapse,
  onMapAction: triggerMapAction
};

export default connect(mapStateToProps, mapDispatchToProps)(Widget);
