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
  data,
  highlightedPlaces,
  slug,
  widgetConfig,
  toggleCollapse,
  toggleActive,
  layersIds,
  layerId,
  isActive,
  template: Template,
  isCollapsed,
  isLoading,
  name,
  ...props
}) {
  const getDataBySlug = () => {
    if (slug === 'highlighted_places') return widgetConfig.parse(highlightedPlaces);
    return widgetConfig.parse(data);
  };

  const templateProps = {
    name,
    isActive,
    isCollapsed,
    isLoading,
    layersIds,
    slug,
    data: getDataBySlug(),
    widgetConfig,
    ...props,
  };

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

  return (
    <div
      className={
        classnames(styles.widget, {
          [styles.collapsed]: isCollapsed,
          [styles.layerActive]: isActive
        })
      }
    >

      <div className={styles.wrapper}>
        <div className={styles.header}>
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
          {haveLayers && (
            <Button
              hasBackground={isActive}
              hasContrast={!isActive}
              isActive={isActive}
              onClick={activeToggleHandler}
            >
              {isActive ? 'Hide layer' : 'Show layer'}
            </Button>
          )}
        </div>
        {isLoading
          ? <Spinner isLoading />
          : (
            <div className={classnames(styles.content)}>
              <Template {...templateProps} />
            </div>
          )
        }
      </div>

      <WidgetInfo
        data={templateProps.data}
        filename={templateProps.slug}
        {...templateProps}
      />
    </div>
  );
}

Widget.propTypes = {
  data: PropTypes.shape({}),
  highlightedPlaces: PropTypes.arrayOf(PropTypes.shape({})),
  name: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  widgetConfig: PropTypes.shape({}).isRequired,
  layerId: PropTypes.string,
  layersIds: PropTypes.arrayOf(PropTypes.string),
  location: PropTypes.shape({}),
  isActive: PropTypes.bool,
  isCollapsed: PropTypes.bool,
  isLoading: PropTypes.bool,
  toggleActive: PropTypes.func,
  toggleCollapse: PropTypes.func,
  template: PropTypes.func.isRequired
};

Widget.defaultProps = {
  data: null,
  highlightedPlaces: null,
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
