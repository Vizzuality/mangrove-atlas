import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import MediaQuery from 'react-responsive';
import { breakpoints } from 'utils/responsive';import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import LegendItem from './legend-item';
import styles from './style.module.scss';

const Legend = ({ layers, isCollapsed, toggleCollapse }) => {
  const onToggleCollapsed = () => {
    toggleCollapse(!isCollapsed);
  };

  return (
    <Fragment>
      <MediaQuery maxWidth={breakpoints.md - 1}>
        <div className={styles.layersCollapse}>
          <div className={classnames(styles.title,
            { [styles.collapse]: !isCollapsed })}
          >
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
      </MediaQuery>

      {layers.map(layer => <LegendItem key={layer.id} {...layer} />)}
    </Fragment>
  );
};

Legend.propTypes = {
  layers: PropTypes.arrayOf(PropTypes.shape({})),
  isCollapsed: PropTypes.bool.isRequired,
  toggleCollapse: PropTypes.func.isRequired
};

Legend.defaultProps = {
  layers: []
};

export default Legend;
