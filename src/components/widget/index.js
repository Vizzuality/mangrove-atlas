import { connect } from 'react-redux';

import { toggleCollapse, toggleActive } from 'modules/widgets/actions';
import Widget from './component';

const mapStateToProps = () => ({
});

const mapDispatchToProps = {
  toggleCollapse,
  toggleActive
};

export default connect(mapStateToProps, mapDispatchToProps)(Widget);
