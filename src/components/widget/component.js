import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Button from 'components/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import styles from './style.module.scss';

const Widget = ({
  id,
  name,
  isCollapsed,
  chart: Chart,
  onMapAction,
  toggleCollapse
}) => {
  const mapActionHandler = () => {
    onMapAction({ id });
  };

  const collapseToggleHandler = () => {
    toggleCollapse({ id, isCollapsed: !isCollapsed });
  };

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <button
          type="button"
          className={styles.title}
          onClick={collapseToggleHandler}
        >
          {isCollapsed
            ? <FontAwesomeIcon icon={faChevronDown} />
            : <FontAwesomeIcon icon={faChevronUp} />}
          {name}
        </button>
        <Button onClick={mapActionHandler}>Show layer</Button>
      </div>
      <div className={classnames(styles.content, { [styles.collapsed]: isCollapsed })}>
        <Chart />
      </div>
    </div>
  );
};

Widget.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isCollapsed: PropTypes.bool,
  chart: PropTypes.func, // It is actually a function stateless component
  onMapAction: PropTypes.func,
  toggleCollapse: PropTypes.func
};

Widget.defaultProps = {
  isCollapsed: false,
  chart: (
    <h1>Just a placeholder.</h1>
  ),
  onMapAction: () => {},
  toggleCollapse: () => {}
};

export default Widget;
