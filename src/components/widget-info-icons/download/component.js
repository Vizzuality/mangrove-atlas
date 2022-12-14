import React, { useState } from 'react';
import PropTypes from 'prop-types';

import cx from 'classnames';

// components
import Modal from 'components/modal';
import Icon from 'components/icon';

import { INFO } from './constants';
import styles from './style.module.scss';


const Download = ({ slug }) => {
  const [isOpen, toggleModal] = useState(false);
  const [isCollapsed, toggleCollapse] = useState({});

  const handleModal = () => {
    toggleModal(!isOpen);
  };

  const handleClick = (id) => {
    toggleCollapse({ ...isCollapsed, [id]: !isCollapsed[id] });
  }

  if (!INFO[slug]) return null;

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
        maxHeight
      >
        <div className={styles.modalContent}>
          <h2>Download Data</h2>
          {INFO[slug].map(({ id, title, href, description, license }) => (
            <div key={id} className={styles.infoContent}>
              <div className={styles.headings}>
                <div className={cx(styles.title, { [styles._collapsed]: isCollapsed[id] })} onClick={() => handleClick(id)}>
                  <Icon
                    name="arrow_border"
                    alt={isCollapsed ? 'expand content' : 'collapse content'}
                    className={cx(styles.modalIcon,
                      { [styles._collapsed]: isCollapsed[id],
                        [styles._hidden]: !description
                    })}
                  />
                  <h3 className={cx({ [styles._noicon]: !description })}>{title}</h3>
                </div>
                {href && <a href={href} target="_blank" rel="noopener noreferrer">DOWNLOAD</a>}
              </div>
              <p className={cx({ [styles._collapsed]: isCollapsed[id] })}>{description}</p>
              <p>{license}</p>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};

Download.propTypes = {
  isOpened: PropTypes.bool,
};

Download.defaultProps = {
  isOpened: false,
};

export default Download;


