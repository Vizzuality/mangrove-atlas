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
  data,
  name,
  slug,
  filename,
  layerId,
  layersIds,
  isActive,
  isLocationsModal,
  isCollapsed,
  isLoading,
  toggleActive,
  toggleCollapse
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
    [styles._modal]: isLocationsModal,
    [styles._collapsed]: isCollapsed,
    [styles._layerActive]: isActive
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
      <MediaQuery minWidth={breakpoints.lg}>
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
    <div className={classnames(styles.widget, widgetConditionalStyles)}>
      <div className={classnames(styles.wrapper, {
        [styles._modal]: isLocationsModal
      })}>
        {!isLocationsModal &&
          <div className={styles.header}>
            <CollapseButton />
            <ToggleLayersButton />
          </div>
        }
        {isLoading
          ? <Spinner />
          : (
            <div className={classnames(styles.content)}>
              {children}
            </div>
          )
        }
      </div>

      {!isLocationsModal &&
        <WidgetInfo data={data} filename={filename} />
      }
    </div>
  );
}

Widget.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.array
  ]).isRequired,
  name: PropTypes.string,
  slug: PropTypes.string,
  filename: PropTypes.string,
  layerId: PropTypes.string,
  layersIds: PropTypes.arrayOf(PropTypes.string),
  isActive: PropTypes.bool,
  isLocationsModal: PropTypes.bool,
  isCollapsed: PropTypes.bool,
  isLoading: PropTypes.bool,
  toggleActive: PropTypes.func,
  toggleCollapse: PropTypes.func,
};

Widget.defaultProps = {
  name: null,
  slug: null,
  filename: null,
  layerId: null,
  layersIds: null,
  isActive: false,
  isLocationsModal: false,
  isCollapsed: false,
  isLoading: false,
  toggleActive: () => { },
  toggleCollapse: () => { }
};

export default Widget;
