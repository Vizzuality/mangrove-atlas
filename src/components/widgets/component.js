import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

const Widgets = ({ list }) => (
  <Fragment>
    { list.map(widget => (
      <div className={styles.widget_wrapper}>
        <h2 key={widget.id} className={styles.widget_title}>{widget.title}</h2>
      </div>
    )) }
  </Fragment>
);

Widgets.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    })
  ).isRequired
};

export default Widgets;
