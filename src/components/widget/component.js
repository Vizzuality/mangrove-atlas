import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import classnames from 'classnames';
import styles from './style.module.scss';

const Widget = ({
  id,
  title,
  slug,
  isCollapsed,
  children,
  onMapAction,
  onCollapseToggle,
  widgetConfig,
  ...props
}) => {
  const mapActionHandler = () => {
    onMapAction({ id });
  };

  const collapseToggleHandler = () => {
    onCollapseToggle({ id, isCollapsed: !isCollapsed });
  };

  // TODO: Fetch widget data and pass to parse
  // For now, fake mangroves coverate
  let widgetData;
  if (slug) {
    widgetData = widgetConfig.parse({ rows: [1, 2] });
  } else {
    widgetData = widgetConfig.parse({ rows: [] });
  }

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
        {children({
          id,
          title,
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
  title: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  widgetConfig: PropTypes.shape({}).isRequired,
  isCollapsed: PropTypes.bool,
  children: PropTypes.func.isRequired,
  onMapAction: PropTypes.func,
  onCollapseToggle: PropTypes.func
};

Widget.defaultProps = {
  isCollapsed: false,
  onMapAction: () => {},
  onCollapseToggle: () => {}
};

export default Widget;
