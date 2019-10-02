import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import OnScroll from 'react-on-scroll';
import { breakpoints } from 'utils/responsive';
import Header from 'components/header';
import Button from 'components/button';
import LanguageSelect from 'components/language-selector';
import styles from './style.module.scss';

class Dashboard extends Component {
  static propTypes = {
    children: PropTypes.func,
    collapseAll: PropTypes.func,
    expandAll: PropTypes.func,
    isCollapsed: PropTypes.bool
  }

  static defaultProps = {
    children: null,
    isCollapsed: false,
    collapseAll: () => null,
    expandAll: () => null
  }

  state = {
    sticky: false,
    securityMargin: false
  }

  setSticky = sticky => (
    this.setState({ sticky })
  )

  onClickCollapseAll = () => {
    const { collapseAll } = this.props;
    collapseAll();
  }

  onClickExpandAll = () => {
    const { expandAll } = this.props;
    expandAll();
  }

  setMargin = securityMargin => (
    this.setState({ securityMargin })
  )

  render() {
    const { children: Children, isCollapsed } = this.props;
    const { sticky, securityMargin } = this.state;

    return (
      <OnScroll
        className={classnames(styles.sidebar, {
          [styles.securityMargin]: securityMargin
        })}
        triggers={window.innerWidth > breakpoints.lg
          ? [{ top: -65, callback: _sticky => this.setSticky(!_sticky) },
            { top: -10, callback: securityMargin => this.setMargin(!securityMargin) }]
          : [{ top: -1, callback: _sticky => this.setSticky(!_sticky) }]
          }
      >
        <div className={styles.header}>
          <Header sticky={sticky} />
          <div className={styles.actionBar}>
            {
              isCollapsed
                ? (
                  <Button
                    hasBackground
                    hasContrast
                    onClick={this.onClickExpandAll}
                  >
                    Expand all widgets
                  </Button>
                )
                : (
                  <Button
                    isTransparent
                    isGrey
                    onClick={this.onClickCollapseAll}
                  >
                    Collapse all widgets
                  </Button>
                )}
            <LanguageSelect />
          </div>
        </div>
        <Children isSticky={sticky} />
      </OnScroll>
    );
  }
}

export default Dashboard;
