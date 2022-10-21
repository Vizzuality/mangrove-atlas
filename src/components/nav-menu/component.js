import React, { useState } from 'react';
import cx from 'classnames';

// components
import Icon from 'components/icon';
import Modal from 'components/modal';
import LanguageSelect from 'components/language-selector';
import HotspotsList from 'components/hotspots-list';

// images
import logo from './mangrove-alliance.png';
import convened from './convened.png';
import supported from './supported.png';
import donors from './donors.png';
import vizzuality from './vizzuality.png';

import styles from './style.module.scss';

const NavMenu = ({ mobile }) => {
  const myStorage = window.localStorage;
  const modalStatus = myStorage.getItem('modal');
  const [isOpen, toggleModal] = useState(modalStatus === null);
  const [welcomeContent, toggleMessage] = useState(modalStatus === null);
  const [aboutContent, toggleContent] = useState(false);

  const handleOpen = () => {
    toggleModal(!isOpen);
    toggleContent(false);
  };

  const handleClose = () => {
    myStorage.setItem('modal', false);
    toggleMessage(false);
    toggleModal(!isOpen);
    toggleContent(false);
  };

  const handleContent = () => {
    toggleMessage(false);
    toggleContent(true);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className={cx(styles.navMenu, {
          [styles.mobile]: mobile,
          [styles._active]: isOpen,
        })}
      >
        <span className={styles.menuItemTitle}>Menu</span>
        <Icon name="menu" alt="Menu" className={styles.icon} />
      </button>
      <Modal
        isOpen={isOpen}
        onRequestClose={handleClose}
        maxHeight
      >
        <div className={styles.modalContent}>

          {welcomeContent && (
            <section className={styles.introModalContent}>
              <h3>Welcome to Global Mangrove Watch </h3>
              <h4>Monitoring to catalyse the action needed to protect and restore mangroves</h4>
              <p>Thriving mangroves are key to the health of nature and effective climate action.
                Global Mangrove Watch (GMW) is an online platform that provides the remote sensing
                data and tools for monitoring mangroves necessary for this. It gives universal
                access to near real-time information on where and what changes there are
                to mangroves across the world, and highlights why they are valuable.
              </p>
              <p onClick={handleContent}>
                Close this message to continue or find out more about Global Mangrove Watch&nbsp;
                <span>here.</span>
              </p>

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
                access to near real-time information on where and what changes there are to mangroves across the world, and highlights why they are valuable.
              </p>

              <p>With hi-res information on topography, soil conditions and hydrology, Global Mangrove Watch gives
                coastal and park managers, conservationists, policymakers and practitioners the evidence
                needed to respond to illegal logging, pinpoint the causes of local mangrove loss and track
                restoration progress. It is a tool that can help mangroves be central to climate mitigation,
                adaptation and sustainable development plans and policies.
              </p>

              <h4>Global Mangrove Watch Partners</h4>
              <p>The Global mangrove Watch (GMW) was established in 2011 under the Japan Aerospace Exploration Agency’s <a onClick={handleClose} href="https://www.eorc.jaxa.jp/ALOS/en/kyoto/mangrovewatch.htm" target="_blank" rel="noopener noreferrer">(JAXA) Kyoto & Carbon Initiative</a> by Aberystwyth University, solo Earth Observation and the International Water Management Institute, with the aim to provide open access geospatial information about mangrove extent and changes to the Ramsar Convention on Wetlands. In collaboration with Wetlands International and with support from DOB Ecology, the first GMW baseline maps were released in 2018 at the Ramsar COP13. The GMW maps also constitute the official mangrove datasets used by UNEP for reporting on Sustainable Development Goal 6.6.1 (change in the extent of water-related ecosystems over time).
              </p>

              <p>With support from the Oak Foundation, COmON Foundation, DOB Ecology and the Dutch Postcode Lottery, The Nature Conservancy, Wetlands International, Aberystwyth University, and soloEO in 2019 initiated a deeper collaboration, and are working with NASA, JAXA, IWMI, UNEP-WCMC and a host of partners to develop the Global Mangrove Watch Platform.
              </p>

              <h4>GMW and the Global Mangrove Alliance</h4>
              <p>A coordinated effort across sectors and geographies will accomplish more, faster. Global Mangrove Watch is the
                evidence base informing the Global Mangrove Alliance, a collaboration of organisations working to increase
                the world’s mangrove cover 20% by 2030.
                <a onClick={handleClose} href="http://www.mangrovealliance.org/" target="_blank" rel="noopener noreferrer">
                  &nbsp;Learn more at MangroveAlliance.org.
                </a>
              </p>

              <p>Got a query? Contact <a href="mailto://contact@mangrovealliance.org">Mangrove Alliance</a></p>
              <p>Convened by</p>
              <img src={convened} alt="Convened by Aberystwyth University, soloEO, TNC, Wetlands International" />

              <p>Supported by</p>
              <img src={supported} alt="Supported by University of Cambridge, JAXA, NASA, IUCN, Griffith University, Conservation International, WWF, Scripps Institution of Oceanography" />

              <p>Donors</p>
              <img src={donors} alt="DOB Ecology, Oak Foundation, Dutch Postcode Lottery, COmON Foundation" />

              <p>Designed by:</p>
                <a href="https://www.vizzuality.com/" alt="vizzuality" target="_blank" rel="noopener noreferrer"><img src={vizzuality} className={styles.logo} alt="vizzuality" /></a>

              <h4>Disclaimer</h4>
              <p>
                THE USE OF THESE SERVICES AND CONTENT IS AT YOUR SOLE RISK. THE SERVICES AND CONTENT ARE PROVIDED ON AN “AS IS” BASIS
                AND WITHOUT WARRANTIES OR REPRESENTATIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW,
                WE DISCLAIM ALL WARRANTIES, STATUTORY, EXPRESS OR IMPLIED, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. ACTUAL CONDITIONS MAY DIFFER FROM MAPS AND INFORMATION
                PROVIDED BY THE SERVICES. WE DO NOT WARRANT THAT THE CONTENT OR SERVICES WILL BE ERROR FREE, ACCURATE OR WITHOUT INTERRUPTION.
              </p>
            </section>
          )}
          {(!welcomeContent && !aboutContent) && (
            <section>
              <h3>Welcome to Global Mangrove Watch </h3>
              <button className={styles.menuItem} type="button" onClick={handleContent}>
                About Global Mangrove Watch
              </button>
              <nav>
                Global Mangrove Alliance
                <a onClick={handleClose} href="https://www.mangrovealliance.org/about-us/" target="_blank" rel="noopener noreferrer">
                  About
                </a>
                <a onClick={handleClose} href="https://www.mangrovealliance.org/mangrove-forests/" target="_blank" rel="noopener noreferrer">
                  Mangroves
                </a>
                <a onClick={handleClose} href="https://www.mangrovealliance.org/initiatives/" target="_blank" rel="noopener noreferrer">
                  Initiatives
                </a>
                <a onClick={handleClose} href="https://www.mangrovealliance.org/news/" target="_blank" rel="noopener noreferrer">
                  News
                </a>
                <a onClick={handleClose} href="https://www.mangrovealliance.org/resources/" target="_blank" rel="noopener noreferrer">
                  Resources
                </a>
                <a onClick={handleClose} href="https://www.mangrovealliance.org/contact/" target="_blank" rel="noopener noreferrer">
                  Contact
                </a>
              </nav>

              <aside className={styles.footer}>
                <a onClick={handleClose} href="https://www.mangrovealliance.org/" target="_blank" rel="noopener noreferrer">
                  <img src={logo} className={styles.logo} alt="Global Mangrove Alliance" />
                </a>
                <LanguageSelect />
              </aside>
            </section>
          )}
        </div>
      </Modal>
    </>
  );
};

export default NavMenu;
