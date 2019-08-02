import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/button';
import Spinner from 'components/spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import classnames from 'classnames';
import APIService from 'services/api-service';
import styles from './style.module.scss';

const service = new APIService();

class Widget extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    widgetConfig: PropTypes.shape({}).isRequired,
    layerId: PropTypes.string,
    layersIds: PropTypes.arrayOf(PropTypes.string),
    isActive: PropTypes.bool,
    isCollapsed: PropTypes.bool,
    isLoading: PropTypes.bool,
    children: PropTypes.func.isRequired,
    toggleActive: PropTypes.func,
    toggleCollapse: PropTypes.func
  };

  static defaultProps = {
    isActive: false,
    isCollapsed: false,
    isLoading: false,
    layerId: null,
    layersIds: null,
    toggleActive: () => { },
    toggleCollapse: () => { }
  };

  state = {
    loading: false,
    error: null,
    data: null
  }

  componentDidMount() {
    this.fetchWidget();
  }

  activeToggleHandler = () => {
    const { layersIds, toggleActive, slug, isActive, layerId } = this.props;
    if (layersIds) {
      layersIds.forEach(lId => toggleActive({ slug, layerId: lId, isActive: !isActive }));
    } else {
      toggleActive({ slug, layerId, isActive: !isActive });
    }
  };

  collapseToggleHandler = () => {
    const { toggleCollapse, slug } = this.props;
    toggleCollapse({ slug });
  };

  fetchWidget() {
    const { slug } = this.props;
    this.setState({ loading: true });

    if (slug && slug !== 'highlighted_places') {
      service.fetchWidgetData({ slug })
        .then(data => this.setState({ data, loading: false }));
    }
  }

  render() {
    const { loading, error, data } = this.state;
    const {
      name, widgetConfig, isCollapsed, isActive, isLoading, layerId,
      children, slug, ...props
    } = this.props;

    const widgetData = widgetConfig.parse(data);
    console.log(widgetData);

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
        {isLoading && <Spinner isLoading />}
        <div className={classnames(styles.content)}>
          {children({
            name,
            slug,
            isCollapsed,
            data: widgetData,
            ...props
          })}
        </div>
      </div>
    );
  }
}
export default Widget;
