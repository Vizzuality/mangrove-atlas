import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import classnames from 'classnames';
import styles from './style.module.scss';

const Widget = ({
  id,
  name,
  slug,
  layerId,
  isActive,
  isCollapsed,
  children,
  toggleActive,
  toggleCollapse,
  widgetConfig,
  ...props
}) => {
  const activeToggleHandler = () => {
    toggleActive({ id, layerId, isActive: !isActive });
  };

  const collapseToggleHandler = () => {
    toggleCollapse({ id });
  };

  const widgetData = widgetConfig.parse({ });

  return (
    <div
      className={
        classnames(styles.widget, {
          [styles.collapsed]: isCollapsed,
          [styles.layerActive]: isActive
        })
      }
    >
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
        {isActive
          ? <Button isActive onClick={activeToggleHandler}>Hide layer</Button>
          : <Button onClick={activeToggleHandler}>Show layer</Button>}
      </div>

      <div className={classnames(styles.content)}>
        {children({
          id,
          name,
          slug,
          isCollapsed,
          data: widgetData,
          ...props
        })}
      </div>
    </div>
  );
};

Widget.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  widgetConfig: PropTypes.shape({}).isRequired,
  layerId: PropTypes.string,
  isActive: PropTypes.bool,
  isCollapsed: PropTypes.bool,
  children: PropTypes.func.isRequired,
  toggleActive: PropTypes.func,
  toggleCollapse: PropTypes.func
};

Widget.defaultProps = {
  isActive: false,
  isCollapsed: false,
  layerId: null,
  toggleActive: () => {},
  toggleCollapse: () => {}
};

export default Widget;
