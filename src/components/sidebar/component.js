import React, { Component } from 'react';
import PropTypes from 'prop-types';
import OnScroll from 'react-on-scroll';
import Header from 'components/header';
import styles from './style.module.scss';

class Dashboard extends Component {
  static propTypes = {
    children: PropTypes.node
  };

  static defaultProps = {
    children: null
  };

  state = { sticky: false }

  setSticky = sticky => console.log(sticky) || this.setState({ sticky })

  render() {
    const { children } = this.props;
    const { sticky } = this.state;

    return (
      <OnScroll
        className={styles.sidebar}
        triggers={[
          { top: -40, callback: sticky => this.setSticky(sticky) },
        ]}
      >
        <Header sticky />
        {children}
      </OnScroll>
    );
  }
}

export default Dashboard;
