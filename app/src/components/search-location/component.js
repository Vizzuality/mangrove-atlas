import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

// components
import Icon from 'components/icon';

import styles from './style.module.scss';

const SearchLocation = ({
  mobile,
  openSearchPanel,
}) => (
  <button className={cx(styles.sidebarItem, { [styles.mobile]: mobile })} type="button" onClick={() => openSearchPanel()}>
    <span className={styles.menuItemTitle}>Places</span>
    <Icon name="places" alt="Search" />
  </button>
);

SearchLocation.propTypes = {
  mobile: PropTypes.bool,
  openSearchPanel: PropTypes.func
};

SearchLocation.defaultProps = {
  mobile: false,
  openSearchPanel: null
};


export default SearchLocation;
