import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import Modal from 'components/modal';
import LanguageSelect from 'components/language-selector';
import HotspotsList from 'components/hotspots-list';
import logo from './mangrove-alliance.png';

import styles from './style.module.scss';

const NavMenu = ({ fixedHeader }) => {
  const [isOpen, toggleModal] = useState(false);
  const [welcomeContent, toggleContent] = useState(false);

  useEffect(() => {
    toggleContent(false);
  }, [isOpen]);

  const handleClick = () => {
    toggleModal(!isOpen);
  };

  const handleContent = () => {
    toggleContent(!welcomeContent);
  };

  return (
    <div className={classnames({ [styles.fixedNavMenu]: fixedHeader,
      [styles.navMenu]: !fixedHeader })}
    >
      <button type="button" onClick={handleClick} />
      <Modal
        isOpen={isOpen}
        onRequestClose={() => toggleModal(false)}
      >
        <div className={styles.modalContent}>
          <h3>Global Mangrove Watch</h3>
          {welcomeContent ? (
            <div className={styles.introModalContent}>
              <p>Lorem ipsum dolor sit amet, casius ariza inga tesebe consectetur adipiscing elit.
              Aenean lacinia bibendum nulla sed. Maecenas sed diam eget risus varius blandit sit amet non magna caceres.
              Maecenas sed diam eget risus varius blandit sit amet non magna caceres.  Sociis natoque penatibus et magnis dis lalinos parturient montes, nascetur ridiculus mus.</p>
              <a className={styles.welcomeLink} href="http://www.mangrovealliance.org/" target="_blank" rel="noopener noreferrer">Learn more about Mangroves Atlas</a>
              <a className={styles.welcomeLink} href="http://www.mangrovealliance.org/" target="_blank" rel="noopener noreferrer">Visit Global Mangrove Alliance website</a>
              <HotspotsList />
            </div>
          )
            : (
              <>
                <section>
                  <button className={styles.menuItem} type="button" onClick={handleContent}>
                    About this tool
                  </button>
                  <nav>
                    Global Mangrove Alliance
                    <a onClick={handleClick} href="http://www.mangrovealliance.org/mangrove-knowledge/" target="_blank" rel="noopener noreferrer">
                      About
                    </a>
                    <a onClick={handleClick} href="http://www.mangrovealliance.org/mangrove-forests/" target="_blank" rel="noopener noreferrer">
                      Mangroves
                    </a>
                    <a onClick={handleClick} href="hhttp://www.mangrovealliance.org/initiatives/" target="_blank" rel="noopener noreferrer">
                      Initiatives
                    </a>
                    <a onClick={handleClick} href="http://www.mangrovealliance.org/news/" target="_blank" rel="noopener noreferrer">
                      News
                    </a>
                    <a onClick={handleClick} href="http://www.mangrovealliance.org/resources/" target="_blank" rel="noopener noreferrer">
                      Resources
                    </a>
                    <a onClick={handleClick} href="http://www.mangrovealliance.org/contact/" target="_blank" rel="noopener noreferrer">
                      Contact
                    </a>
                  </nav>

                  <aside className={styles.footer}>
                    <a onClick={handleClick} href="http://www.mangrovealliance.org/" target="_blank" rel="noopener noreferrer">
                      <img src={logo} className={styles.logo} alt="Global Mangrove Alliance" />
                    </a>
                    <LanguageSelect />
                  </aside>
                </section>
              </>)}
        </div>
      </Modal>
    </div>
  );
};


export default NavMenu;
