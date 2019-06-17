import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Button from 'components/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import styles from './style.module.scss';

const Widget = ({
  id,
  title,
  isCollapsed,
  chart: Chart,
  onMapAction,
  onCollapseToggle
}) => {
  const mapActionHandler = () => {
    onMapAction({ id });
  };

  const collapseToggleHandler = () => {
    onCollapseToggle({ id, isCollapsed: !isCollapsed });
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
          {title}
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
  title: PropTypes.string.isRequired,
  isCollapsed: PropTypes.bool,
  chart: PropTypes.func, // It is actually a function stateless component
  onMapAction: PropTypes.func,
  onCollapseToggle: PropTypes.func
};

Widget.defaultProps = {
  isCollapsed: false,
  chart: (
    <h1>Just a placeholder.</h1>
  ),
  onMapAction: () => {},
  onCollapseToggle: () => {}
};

export default Widget;
