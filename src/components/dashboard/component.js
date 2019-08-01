import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import OnScroll from 'react-on-scroll';

class Dashboard extends PureComponent {
  static propTypes = {
    setHeader: PropTypes.func
  };

  static defaultProps = {
    setHeader: () => null
  };

  render() {
    const { setHeader, children } = this.props;
    return (
      <OnScroll
        triggers={[
          { top: -40, callback: () => setHeader(true) },
        ]}
      >
      {children}
      </OnScroll>
    );
  }
}

export default Dashboard;
