import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import styles from './style.module.scss';

const WidgetMenu = ({ currentDashboard, dashboards, setCurrent }) => {
  return (
    <nav className={styles.widget_menu}>
      <ul>
        {dashboards.map(({ slug, name }) => (
        <li key={slug} onClick={() => setCurrent(slug)} className={cx({ [styles._active]: currentDashboard === slug })}>
          {name}
        </li>))}
      </ul>
    </nav>
  );
};

WidgetMenu.propTypes = {
  currentDashboard: PropTypes.string.isRequired,
  dashboards: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string,
      name: PropTypes.string
    })
  ),
  setDashboard: PropTypes.func.isRequired
};

export default WidgetMenu;
