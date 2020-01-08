import React from 'react';
import Link from 'redux-first-router-link';
import styles from './style.module.scss';

const NotFoundPage = () => (
  <div className={styles.wrapper}>
    <div className={styles.content}>
      <h1>404</h1>
      <p>This page could not be found</p>
      <Link to={{ type: 'PAGE/APP' }}>Go to Homepage</Link>
    </div>
  </div>);

export default NotFoundPage;
