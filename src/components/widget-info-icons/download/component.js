import React, { useState } from 'react';
import PropTypes from 'prop-types';

import cx from 'classnames';

// components
import Modal from 'components/modal';
import Icon from 'components/icon';

import { INFO } from './constants';
import styles from './style.module.scss';


const Download = ({ name, slug }) => {
  const [isOpen, toggleModal] = useState(false);
  const [isCollapsed, toggleCollapse] = useState({});

  const handleModal = () => {
    toggleModal(!isOpen);
  };

  const handleClick = (id) => {
    toggleCollapse({ ...isCollapsed, [id]: !isCollapsed[id] });
  }

  return (
    <>
      <button
        onClick={handleModal}
        className={cx(styles.modalBtn)}
      >
        <Icon name="download" alt="Download" className={styles.modalIcon} />
      </button>
      <Modal
        isOpen={isOpen}
        onRequestClose={handleModal}
        closeButton
      >
        <div className={styles.modalContent}>
          <h2>Download Data</h2>
          {INFO[slug].map(({ id, title, href, description }) => (
            <div key={id} className={styles.infoContent}>
              <div className={styles.headings}>
                <div className={cx(styles.title, { [styles._collapsed]: isCollapsed[id] })} onClick={() => handleClick(id)}>
                  <Icon
                    name="arrow_border"
                    alt={isCollapsed ? 'expand content' : 'collapse content'}
                    className={cx(styles.modalIcon, { [styles._collapsed]: isCollapsed[id] })}
                  />
                  <h3>{title}</h3>
                </div>
                <a href={href} target="_blank" rel="noreferrer">DOWNLOAD</a>
              </div>
              <p className={cx({ [styles._collapsed]: isCollapsed[id] })}>{description}</p>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};

Download.propTypes = {
  isOpened: PropTypes.bool,
  closeSearchPanel: PropTypes.func
};

Download.defaultProps = {
  isOpened: false,
  closeSearchPanel: () => null
};

export default Download;


