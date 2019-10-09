import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Modal from 'components/modal';
import MediaQuery from 'react-responsive';
import { breakpoints } from 'utils/responsive';
import DangerousHTML from 'react-dangerous-html';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LocationsList from 'components/locations-list';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { widgetInfo } from './widgetInfo';
import styles from './style.module.scss';

class InfoModal extends PureComponent {
  static propTypes = {
    isOpened: PropTypes.bool,
    widgetType: PropTypes.string,
    currentLocation: PropTypes.shape({
      name: PropTypes.string
    }),
    locations: PropTypes.arrayOf(PropTypes.shape({})),
    closeInfoPanel: PropTypes.func
  }

  static defaultProps = {
    isOpened: false,
    widgetType: null,
    currentLocation: { name: 'Location name' },
    locations: [],
    closeInfoPanel: () => null
  }

  state = {
    search: null
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpened) this.reset();
  }

  closeModal = () => {
    const { closeInfoPanel } = this.props;

    closeInfoPanel();
    this.reset();
  }

  reset = () => this.setState({ search: null })

  updateSearch = (e) => {
    if (e.currentTarget.value === '') {
      this.reset();
    } else {
      this.setState({ search: e.currentTarget.value });
    }
    this.closeInfoPanel();
  }

  info = () => {
    const { widgetType } = this.props;
    const widgetSelected = widgetInfo[widgetType];
    if (!widgetSelected) return null;
    const attributes = Object.keys(widgetSelected);
    return attributes.map(attribute => (
      <div>
        <strong>
          {attribute !== 'Title'
            ? attribute + ':'
            : ''}
        </strong> <br /><DangerousHTML html={widgetSelected[attribute]} /><br />
      </div>
    ));
  }

  render() {
    const { isOpened, currentLocation, locations, widgetType } = this.props;
    if (!currentLocation) return null;
    const { search } = this.state;
    const locationsData = search
      ? locations.filter(l => new RegExp(search, 'i').test(l.name))
      : locations;

    const widgetSelected = widgetInfo[widgetType];
    const info = this.info();


    return (
      <Fragment>
        <MediaQuery maxWidth={breakpoints.lg - 1}>
          <Modal
            className={classnames(styles.location, styles.mobile)}
            isOpen={isOpened}
            onRequestClose={this.closeModal}
          >

            {widgetType === 'highlighted_places' && (
              <div className={styles.content}>
                <div className={styles.search}>
                  <input
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    type="text"
                    className={classnames(styles.searchInput, 'notranslate')}
                    placeholder={currentLocation.name}
                    onChange={() => this.updateSearch()}
                  />
                </div>
                <LocationsList locationsData={locationsData} />
              </div>)
            }
            {widgetType !== 'highlighted_places' && widgetSelected && (
              <div className={styles.content}>
                <div className={styles.info}>
                  {info}
                </div>
              </div>
            )}

            <button type="button" onClick={this.closeModal} className={classnames(styles.closeButton, styles.mobile)}>
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
          </Modal>
        </MediaQuery>
        <MediaQuery minWidth={breakpoints.lg}>
          <Modal
            className={styles.location}
            isOpen={isOpened}
            onRequestClose={this.closeModal}
          >
            {widgetType === 'highlighted_places' && (
              <div className={styles.content}>
                <div className={styles.search}>
                  <input
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    autoFocus
                    type="text"
                    className={classnames(styles.searchInput, 'notranslate')}
                    placeholder={currentLocation.name}
                    onChange={this.updateSearch}
                  />
                </div>
                <LocationsList locationsData={locationsData} />
              </div>)
            }
            {widgetType !== 'highlighted_places' && (
              <div className={styles.content}>
                <h1>
                  {widgetType}
                </h1>
                <span className={styles.info}>
                  {info}
                </span>
              </div>
            )}

            <button type="button" onClick={this.closeModal} className={styles.closeButton}>
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
          </Modal>
        </MediaQuery>
      </Fragment>
    );
  }
}

export default InfoModal;
