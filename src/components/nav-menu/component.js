import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import Modal from 'components/modal';
import LanguageSelect from 'components/language-selector';
import HotspotsList from 'components/hotspots-list';
import logo from './mangrove-alliance.png';

import styles from './style.module.scss';

const NavMenu = ({ fixedHeader }) => {
  const myStorage = window.localStorage;
  const modalStatus = myStorage.getItem('modal');
  const modalStatusBoolean = modalStatus && modalStatus.toLowerCase() == 'true' && false;
  const [isOpen, toggleModal] = useState(modalStatus !== null ? modalStatusBoolean : false);
  const [welcomeContent, toggleMessage] = useState(modalStatus !== null ? modalStatusBoolean : false);
  const [aboutContent, toggleContent] = useState(false);

  const handleClick = () => {
    myStorage.setItem('modal', false);
    toggleMessage(false);
    toggleContent(false);
    toggleModal(!isOpen);
  };

  const handleContent = () => {
    toggleContent(!aboutContent);
  };

  return (
    <div className={classnames({
      [styles.fixedNavMenu]: fixedHeader,
      [styles.navMenu]: !fixedHeader
    })}
    >
      <button type="button" onClick={handleClick} />
      <Modal
        isOpen={isOpen}
        onRequestClose={() => toggleModal(false)}
      >
        <div className={styles.modalContent}>

          {welcomeContent && isOpen && (
            <section className={styles.introModalContent}>
              <h3>Welcome to Global Mangrove Watch </h3>
              <h4>Monitoring to catalyse the action needed to protect and restore mangroves</h4>
              <p>Thriving mangroves are key to the health of nature and effective climate action.
                Global Mangrove Watch (GMW) is an online platform that provides the remote sensing
                data and tools for monitoring mangroves necessary for this. It gives universal
                access to near real-time information on where and what changes there are to mangroves across the world.</p>

              <p>Close this message to continue or find out more about Global Mangrove Watch</p> <button type="button" onClick={handleContent()}>here.</button>
              <a className={styles.welcomeLink} href="http://www.mangrovealliance.org/" target="_blank" rel="noopener noreferrer">Visit Global Mangrove Alliance website</a>
              <HotspotsList />
            </section>
          )}
          {(!welcomeContent && aboutContent) && (
            <section className={styles.introModalContent}>
              <h3>About Global Mangrove Watch </h3>
              <h4>Monitoring to catalyse the action needed to protect and restore mangroves</h4>
              <p>Thriving mangroves are key to the health of nature and effective climate action.
                Global Mangrove Watch (GMW) is an online platform that provides the remote sensing
                data and tools for monitoring mangroves necessary for this. It gives universal
                access to near real-time information on where and what changes there are to mangroves across the world.
              </p>

              <p>With 3D, hi-res information on topography, soil conditions and hydrology, Global Mangrove Watch gives
                coastal and park managers, conservationists, policymakers and practitioners the evidence
                needed to respond to illegal logging, pinpoint the causes of local mangrove loss and track
                conservation progress.
              </p>

              <h4>Global Mangrove Watch and the Global Mangrove Alliance</h4>
              <p>Coordinated effort across sectors and geographies will accomplish more, faster. Global Mangrove Watch is the
                evidence base informing the Global Mangrove Alliance, a collaboration of organisations working to increase
                the world’s mangrove cover 20% by 2030.
                <a onClick={handleClick} href="http://www.mangrovealliance.org/" target="_blank" rel="noopener noreferrer">
                  Learn more at MangroveAlliance.org.
                </a>
              </p>

              <h4>Global Mangrove Watch Partners</h4>
              <p>With support from the Oak Foundation, DOB Ecology and the Dutch Postcode Lottery,
                The Nature Conservancy and Wetlands International have worked with Aberystwyth
                University, soloEO, NASA, JAXA, and a host of partners to develop Global Mangrove Watch,
                building on JAXA’s Kyoto and Carbon Initiative.
              </p>
              <p>Convened by</p>

              <ul>

                <li>To ADD WWF</li>
                <li>To ADD WWF</li>
                <li>To ADD CI</li>
                <li>To ADD CI</li>
              </ul>
              <p>Supported by</p>
              <ul>
                <li>To ADD DOB Ecology</li>
                <li>To ADD DOB Ecology</li>
                <li>To ADD NPL</li>
                <li>To ADD NPL</li>
              </ul>

            </section>
          )}
          {(!welcomeContent && !aboutContent) && (
            <section>
              <h3>Welcome to Global Mangrove Watch </h3>
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
          )}
        </div>
      </Modal>
    </div>
  );
};


export default NavMenu;
