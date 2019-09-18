import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/button';
import Spinner from 'components/spinner';
import WidgetInfo from 'components/widget-info';
import MediaQuery from 'react-responsive';
import { breakpoints } from 'utils/responsive';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import classnames from 'classnames';

import styles from './style.module.scss';

function Widget({
  children,
  slug,
  toggleCollapse,
  toggleActive,
  layersIds,
  layerId,
  isActive,
  isCollapsed,
  isLoading,
  name,
  data,
  filename
}) {
  const collapseToggleHandler = () => {
    toggleCollapse({ id: slug });
  };

  const activeToggleHandler = () => {
    if (layersIds) {
      layersIds.forEach(lId => toggleActive({ id: slug, layerId: lId, isActive: !isActive }));
    } else {
      toggleActive({ id: slug, layerId, isActive: !isActive });
    }
  };

  const haveLayers = !!(layersIds && layersIds.length);
  const widgetConditionalStyles = {
    [styles.collapsed]: isCollapsed,
    [styles.layerActive]: isActive
  };

  // These components are declared here not to clutter component's element
  // and make separation of concerns more easy to grasp, they use scope variables
  // to move them away to their own file you should pass scope vars as properties.
  const CollapseButton = () => (
    <button
      type="button"
      className={styles.title}
      onClick={collapseToggleHandler}
    >
      <MediaQuery minWidth={breakpoints.md}>
        {isCollapsed
          ? <FontAwesomeIcon icon={faChevronDown} />
          : <FontAwesomeIcon icon={faChevronUp} />}
      </MediaQuery>
      {name}
    </button>
  );
  const ToggleLayersButton = () => (!haveLayers
    ? null
    : (
      <Button
        hasBackground={isActive}
        hasContrast={!isActive}
        isActive={isActive}
        onClick={activeToggleHandler}
      >
        {isActive ? 'Hide layer' : 'Show layer'}
      </Button>
    )
  );

  return (
    <div className={ classnames(styles.widget, widgetConditionalStyles)}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <CollapseButton />
          <ToggleLayersButton />
        </div>
        {isLoading
          ? <Spinner isLoading />
          : (
            <div className={classnames(styles.content)}>
              {children}
            </div>
          )
        }
      </div>
      <WidgetInfo data={data} filename={filename} />
    </div>
  );
}

Widget.propTypes = {
  name: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  layerId: PropTypes.string,
  layersIds: PropTypes.arrayOf(PropTypes.string),
  location: PropTypes.shape({}),
  isActive: PropTypes.bool,
  isCollapsed: PropTypes.bool,
  isLoading: PropTypes.bool,
  toggleActive: PropTypes.func,
  toggleCollapse: PropTypes.func
};

Widget.defaultProps = {
  isActive: false,
  isCollapsed: false,
  isLoading: false,
  layerId: null,
  layersIds: null,
  location: null,
  toggleActive: () => { },
  toggleCollapse: () => { }
};

export default Widget;