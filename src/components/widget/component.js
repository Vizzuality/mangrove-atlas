import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/button';
import Spinner from 'components/spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import classnames from 'classnames';
import styles from './style.module.scss';

class Widget extends PureComponent {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    widgetConfig: PropTypes.shape({}).isRequired,
    layerId: PropTypes.string,
    layersIds: PropTypes.arrayOf(PropTypes.string),
    isActive: PropTypes.bool,
    isCollapsed: PropTypes.bool,
    children: PropTypes.func.isRequired,
    toggleActive: PropTypes.func,
    toggleCollapse: PropTypes.func
  };

static defaultProps = {
  isActive: false,
  isCollapsed: false,
  layerId: null,
  layersIds: null,
  toggleActive: () => { },
  toggleCollapse: () => { }
};


  activeToggleHandler = () => {
    const { layersIds, toggleActive, id, isActive, layerId } = this.props;
    if (layersIds) {
      layersIds.forEach(lId => toggleActive({ id, layerId: lId, isActive: !isActive }));
    } else {
      toggleActive({ id, layerId, isActive: !isActive });
    }
  };

  collapseToggleHandler = () => {
    const { toggleCollapse, id } = this.props;
    toggleCollapse({ id });
  };

  render() {
    const { isLoading } = this.props;
    const { name, widgetConfig, isCollapsed, isActive, layerId, children, id, slug } = this.props;

    const widgetData = widgetConfig.parse({});

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
            {isCollapsed
              ? <FontAwesomeIcon icon={faChevronDown} />
              : <FontAwesomeIcon icon={faChevronUp} />}
            {name}
          </button>
          {layerId && (
            <Button isActive={isActive} onClick={this.activeToggleHandler}>
              {isActive ? 'Hide layer' : 'Show layer'}
            </Button>
          )}
        </div>

        {isLoading && <Spinner isLoading />}

        <div className={classnames(styles.content)}>
          {children({
            id,
            name,
            slug,
            isCollapsed,
            data: widgetData,
          })}
        </div>
      </div>
    );
  }
}

export default Widget;
