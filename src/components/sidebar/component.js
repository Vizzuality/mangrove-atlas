import React, { Component } from 'react';
import PropTypes from 'prop-types';
import OnScroll from 'react-on-scroll';
import Header from 'components/header';
import Button from 'components/button';
import LanguageSelect from 'components/language-selector';
import styles from './style.module.scss';

class Dashboard extends Component {
  static propTypes = {
    children: PropTypes.node,
    collapseAll: PropTypes.func,
    expandAll: PropTypes.func
  }

  static defaultProps = {
    children: null,
    collapseAll: () => null,
    expandAll: () => null
  }

  state = { sticky: false }

  setSticky = sticky => this.setState({ sticky })

  onClickCollapseAll = () => {
    const { collapseAll } = this.props;
    collapseAll();
  }

  onClickExpandAll = () => {
    const { expandAll } = this.props;
    expandAll();
  }


  render() {
    const { children, isCollapsed } = this.props;
    const { sticky } = this.state;

    return (
      <OnScroll
        className={styles.sidebar}
        triggers={[
          { top: -65, callback: sticky => this.setSticky(!sticky) },
        ]}
      >
        <div className={styles.header}>
          <Header sticky={sticky} />
          <div className={styles.actionBar}>
            {
              isCollapsed
                ? <Button hasBackground hasContrast onClick={this.onClickExpandAll}>Expand all widgets</Button>
                : <Button isTransparent isGrey onClick={this.onClickCollapseAll}>Collapse all widgets</Button>
            }
            <LanguageSelect />
          </div>
        </div>
        {children}
      </OnScroll>
    );
  }
}

export default Dashboard;
