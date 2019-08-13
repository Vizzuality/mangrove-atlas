import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/button';
import Spinner from 'components/spinner';
import MediaQuery from 'react-responsive';
import { breakpoints } from 'utils/responsive';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import classnames from 'classnames';
import styles from './style.module.scss';

class Widget extends PureComponent {
  static propTypes = {
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
    children: PropTypes.func.isRequired,
    toggleActive: PropTypes.func,
    toggleCollapse: PropTypes.func
  };

  static defaultProps = {
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

  getDataBySlug() {
    const { data, highlightedPlaces, slug, widgetConfig } = this.props;

    if (slug === 'highlighted_places') return widgetConfig.parse(highlightedPlaces);

    return widgetConfig.parse(data);
  }

  collapseToggleHandler = () => {
    const { toggleCollapse, slug } = this.props;

    toggleCollapse({ slug });
  };

  activeToggleHandler = () => {
    const { layersIds, toggleActive, slug, isActive, layerId } = this.props;
    if (layersIds) {
      layersIds.forEach(lId => toggleActive({ slug, layerId: lId, isActive: !isActive }));
    } else {
      toggleActive({ slug, layerId, isActive: !isActive });
    }
  };

  render() {
    const {
      children,
      data,
      isCollapsed,
      isActive,
      isLoading,
      name,
      layersIds,
      slug,
      widgetConfig,
      ...props
    } = this.props;

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
        <div className={styles.header}>
          <button
            type="button"
            className={styles.title}
            onClick={this.collapseToggleHandler}
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
              onClick={this.activeToggleHandler}
            >
              {isActive ? 'Hide layer' : 'Show layer'}
            </Button>
          )}
        </div>
        {isLoading
          ? <Spinner isLoading />
          : (
            <div className={classnames(styles.content)}>
              {children({
                name,
                isActive,
                isCollapsed,
                isLoading,
                layersIds,
                slug,
                data: this.getDataBySlug(slug),
                widgetConfig,
                ...props,
              })}
            </div>
          )
        }
      </div>
    );
  }
}
export default Widget;
