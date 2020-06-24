import React, { useState } from 'react';
import HotspotsList from 'components/hotspots-list';
import Modal from 'components/modal';

import styles from './style.module.scss';

const IntroModal = () => {
  const myStorage = window.localStorage;
  const modalStatus = myStorage.getItem('modal');
  const modalStatusBoolean = modalStatus && modalStatus.toLowerCase() == 'true' && false;

  const [isOpen, toggleModal] = useState(modalStatus !== null ? modalStatusBoolean : true);

  const handleClick = () => {
    myStorage.setItem('modal', false);
    toggleModal(!isOpen);
  };

  return (
    <div className={styles.introModal}>
      <button type="button" onClick={handleClick} className="mapboxgl-ctrl-group">?</button>
      <Modal
        isOpen={isOpen || false}
        onRequestClose={handleClick}
      >
        <div className={styles.introModalContent}>
          <h3>Welcome to Mangroves Atlas</h3>
          <p>Lorem ipsum dolor sit amet, casius ariza inga tesebe consectetur adipiscing elit.
          Aenean lacinia bibendum nulla sed. Maecenas sed diam eget risus varius blandit sit amet non magna caceres. Maecenas sed diam eget risus varius blandit sit amet non magna caceres.  Sociis natoque penatibus et magnis dis lalinos parturient montes, nascetur ridiculus mus.</p>
          <a href="http://www.mangrovealliance.org/" target="_blank" rel="noopener noreferrer">Learn more about Mangroves Atlas</a>
          <a href="http://www.mangrovealliance.org/" target="_blank" rel="noopener noreferrer">Visit Global Mangrove Alliance website</a>
          <HotspotsList />
        </div>
      </Modal>
    </div>
  );
};


export default IntroModal;
