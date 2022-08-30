import React from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import cx from 'classnames';


import './styles.scss';
import styles from './style.module.scss';

const customStyles = {
  overlay: {
    background: 'rgba(0, 0, 0, 0.7)'
  }
};

Modal.setAppElement('#root');

export default (props) => {
  const { children, closeButton = true, title, onRequestClose, widgetsMenu, centered, maxHeight, ...domProps } = props;

  return (
    <Modal
      style={customStyles}
      {...domProps}
      onRequestClose={onRequestClose}
      className={cx({
        [styles.modalWrapper]: !widgetsMenu,
        [styles.widgetsMenu]: widgetsMenu,
        [styles.centered]: centered
      })}
    >
      <div className={cx(styles.content, { [styles.maxHeight]: !!maxHeight })}>
        {children}
      </div>
      {closeButton && <button type="button" onClick={onRequestClose} className={styles.closeButton}>
        <FontAwesomeIcon icon={faTimes} size="lg" />
      </button>}
    </Modal>
  );
};
