import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { breakpoints } from 'utils/responsive';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import styles from './style.module.scss';

const MobileLegendControl = ({ isCollapsed, toggleCollapse, children }) => {
  const onToggleCollapsed = () => {
    toggleCollapse(!isCollapsed);
  };

  return (
    <Fragment>
      <MediaQuery maxWidth={breakpoints.lg - 1}>
        <div className={styles.legendContainer}>
          <div className={styles.layersCollapse}>
            <div className={styles.title}>
              <span>Layers</span>
            </div>
            <button
              type="button"
              className={styles.layersBtn}
              onClick={onToggleCollapsed}
            >
              {isCollapsed
                ? <FontAwesomeIcon icon={faChevronDown} />
                : <FontAwesomeIcon icon={faChevronUp} />
              }
            </button>
          </div>
          {!isCollapsed && children}
        </div>
      </MediaQuery>
    </Fragment>
  );
};

MobileLegendControl.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  toggleCollapse: PropTypes.func.isRequired
};

export default MobileLegendControl;
