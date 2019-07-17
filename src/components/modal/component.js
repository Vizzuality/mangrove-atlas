import React from 'react';
import Modal from 'react-modal';
import './styles.scss';

const customStyles = {
  overlay: {
    background: 'rgba(0, 0, 0, 0.7)'
  }
};

Modal.setAppElement('#root');

export default (props) => {
  const { children, ...domProps } = props;

  return (
    <Modal
      style={customStyles}
      {...domProps}
    >
      {children}
    </Modal>
  );
};
