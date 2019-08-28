import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Modal from 'components/modal';
import MediaQuery from 'react-responsive';
import { breakpoints } from 'utils/responsive';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LocationsList from 'components/locations-list';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
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

  render() {
    const { isOpened, currentLocation, locations, widgetType } = this.props;
    if (!currentLocation) return null;
    const { search } = this.state;
    const locationsData = search
      ? locations.filter(l => new RegExp(search, 'i').test(l.name))
      : locations;

    return (
      <Fragment>
        <MediaQuery maxWidth={breakpoints.md - 1}>
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
            {widgetType !== 'highlighted_places' && (
              <div className={styles.content}>
                <h1>
                  {widgetType}
                </h1>
                <p className={styles.info}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas egestas, dolor non euismod porttitor, nisl est dapibus elit, ut fermentum turpis arcu ac mauris. Donec congue ante quis viverra molestie. Integer dictum tristique nunc, et elementum mi iaculis ac. Vestibulum facilisis vehicula feugiat. Integer tempor augue a pellentesque placerat. Etiam consectetur eget nibh ut tincidunt. Donec efficitur lobortis tortor, at porttitor mi vehicula vitae. Phasellus non justo id augue placerat vestibulum. Duis mattis sapien nisi, non eleifend diam feugiat at. Duis commodo diam ut ligula dictum ultrices. Nam id mi sed quam efficitur mollis id at elit. Nam et leo sagittis tortor gravida consequat. Vestibulum nec risus nibh. Donec dapibus enim eu arcu laoreet sollicitudin. Mauris ultricies sem quis nulla varius pretium. Aliquam sit amet mollis sem.
                </p>
              </div>
            )}

            <button type="button" onClick={this.closeModal} className={classnames(styles.closeButton, styles.mobile)}>
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
          </Modal>
        </MediaQuery>
        <MediaQuery minWidth={breakpoints.md}>
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
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas egestas, dolor non euismod porttitor, nisl est dapibus elit, ut fermentum turpis arcu ac mauris. Donec congue ante quis viverra molestie. Integer dictum tristique nunc, et elementum mi iaculis ac. Vestibulum facilisis vehicula feugiat. Integer tempor augue a pellentesque placerat. Etiam consectetur eget nibh ut tincidunt. Donec efficitur lobortis tortor, at porttitor mi vehicula vitae. Phasellus non justo id augue placerat vestibulum. Duis mattis sapien nisi, non eleifend diam feugiat at. Duis commodo diam ut ligula dictum ultrices. Nam id mi sed quam efficitur mollis id at elit. Nam et leo sagittis tortor gravida consequat. Vestibulum nec risus nibh. Donec dapibus enim eu arcu laoreet sollicitudin. Mauris ultricies sem quis nulla varius pretium. Aliquam sit amet mollis sem.
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
