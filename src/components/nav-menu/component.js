import React, { useState } from 'react';
import Modal from 'components/modal';
import LanguageSelect from 'components/language-selector';
import logo from './mangrove-alliance.png';

import styles from './style.module.scss';

const NavMenu = () => {
  const [isOpen, toggleModal] = useState(false);

  const handleClick = () => {
    toggleModal(!isOpen);
  };

  return (
    <div className={styles.navMenu}>
      <button type="button" onClick={handleClick} className={styles.navMenu} />
      <Modal
        isOpen={isOpen}
        onRequestClose={() => toggleModal(false)}
      >
        <div className={styles.introModalContent}>
          <h3>Mangroves Atlas</h3>
          <ul>
            <li>
              About Mangrove Atlas
            </li>
            <li>
              <a href="http://www.mangrovealliance.org/" target="_blank" rel="noopener noreferrer">
                Global Mangrove Alliance
              </a>
            </li>
            <li>
              <a href="http://www.mangrovealliance.org/mangrove-knowledge/" target="_blank" rel="noopener noreferrer">
                About
              </a>
            </li>
            <li>
              <a href="http://www.mangrovealliance.org/mangrove-forests/" target="_blank" rel="noopener noreferrer">
                Mangroves
              </a>
            </li>
            <li>
              <a href="hhttp://www.mangrovealliance.org/initiatives/" target="_blank" rel="noopener noreferrer">
                Initiatives
              </a>
            </li>
            <li>
              <a href="http://www.mangrovealliance.org/news/" target="_blank" rel="noopener noreferrer">
                News
              </a>
            </li>
            <li>
              <a href="http://www.mangrovealliance.org/resources/" target="_blank" rel="noopener noreferrer">
                Resources
              </a>
            </li>
            <li>
              <a href="https://gma-panda.opendata.arcgis.com/" target="_blank" rel="noopener noreferrer">
                Data Portal
              </a>
            </li>
            <li>
              <a href="http://www.mangrovealliance.org/contact/" target="_blank" rel="noopener noreferrer">
                Contact
              </a>
            </li>
          </ul>
          <aside className={styles.footer}>
            <a href="http://www.mangrovealliance.org/" target="_blank" rel="noopener noreferrer">
              <img src={logo} alt="Global Mangrove Alliance" />
            </a>
            <LanguageSelect />
          </aside>
        </div>
      </Modal>
    </div>
  );
};


export default NavMenu;
