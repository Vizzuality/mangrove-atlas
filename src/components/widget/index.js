import { connect } from 'react-redux';
import { toggleCollapse, toggleActive } from 'modules/widgets/actions';
import { addFilter, removeFilter } from 'modules/map-styles/actions';
import Component from './component';

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  toggleCollapse,
  toggleActive,
  addFilter,
  removeFilter
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
