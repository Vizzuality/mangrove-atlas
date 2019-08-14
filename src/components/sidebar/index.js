import { connect } from 'react-redux';
import { setHeader } from 'modules/pages/actions';
import { expandAll, collapseAll } from 'modules/widgets/actions';
import Component from './component';

const mapStateToProps = state => ({
  header: state.page.header,
  isCollapsed: state.widgets.isCollapsed
});

const mapDispatchToProps = {
  setHeader,
  collapseAll,
  expandAll
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
