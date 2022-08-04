import React, { useState } from 'react';
import PropTypes from 'prop-types';

import DangerousHTML from 'react-dangerous-html';

import cx from 'classnames';

// components
import Modal from 'components/modal';
import Icon from 'components/icon';

import widgetInfo from 'components/widget-info/constants';
import styles from './style.module.scss';

const Info = ({ slug }) => {
  const [isOpen, toggleModal] = useState(false);

  const handleModal = () => {
    toggleModal(!isOpen);
  };

  const info = () => {
    const widgetSelected = widgetInfo[slug];
    if (!widgetSelected) return null;
    const attributes = Object.keys(widgetSelected);

    return attributes.map(attribute => (
      <div key={attribute}>
        <strong>
          {attribute !== 'Title'
            ? `${attribute}:`
            : ''}
        </strong><DangerousHTML html={widgetSelected[attribute]} />
      </div>
    ));
  };

  return (
    <>
      <button
        onClick={handleModal}
        className={cx(styles.modalBtn)}
      >
        <Icon name="info" alt="info" className={styles.modalIcon} />
      </button>
      <Modal
        isOpen={isOpen}
        onRequestClose={handleModal}
      >
        <div className={styles.modalContent}>
          {info()}
        </div>
      </Modal>
    </>
  );
};

Info.propTypes = {
  isOpened: PropTypes.bool,
  closeSearchPanel: PropTypes.func
};

Info.defaultProps = {
  isOpened: false,
  closeSearchPanel: () => null
};

export default Info;


