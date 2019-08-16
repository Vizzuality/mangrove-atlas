import React, { PureComponent } from 'react';
import ReactSelect from 'react-select';
import PropTypes from 'prop-types';

import { styles, theme } from './style';

class Select extends PureComponent {
  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func
  };

  static defaultProps = {
    value: null,
    onChange: () => null
  }

  state = { selectedOption: null }

  options = {
    isSearchable: false,
    theme,
    styles
  }

  constructor(props) {
    super(props);
    this.state = { selectedOption: props.value };
  }

  handleChange = (selectedOption) => {
    const { onChange } = this.props;
    this.setState({ selectedOption });
    onChange(selectedOption.value);
  }

  render() {
    const { value: defaultValue, options, onChange, ...props } = this.props;
    const { selectedOption } = this.state;
    const selectedValue = options.find(opt => opt.value === selectedOption);

    return (
      <ul className={styles.list}>
        <li className={classnames(styles.listItem, 'notranslate')}>
          <Link to={{ type: 'PAGE/APP', payload: { id: 'worldwide' } }}>Worldwide</Link>
        </li>
        {locationsData.map(location => (
          <li key={location.id} className={classnames(styles.listItem, 'notranslate')}>
            {location.location_type === 'aoi'
              && (
                <Link to={{ type: 'PAGE/AOI', payload: { id: location.id } }}>
                  <div className={styles.items}>
                    <span>
                      {location.name}
                      {location.name}
                      {location.location_type}
                    </span>
                    <span className={styles.tag}>
                      {location.location_type}
                    </span>
                  </div>
                </Link>
              )}
            {location.location_type === 'country'
              && (
                <Link to={{ type: 'PAGE/COUNTRY', payload: { iso: location.iso } }}>
                  <div className={styles.items}>
                    <span>
                      {location.name}
                    </span>
                    <span className={styles.tag}>
                      {location.location_type}
                    </span>
                  </div>
                </Link>
              )}
            {location.location_type === 'wdpa'
              && (
                <Link to={{ type: 'PAGE/WDPA', payload: { id: location.id } }}>
                  <div className={styles.items}>
                    <span>
                      {location.name}
                    </span>
                    <span className={styles.tag}>
                      {location.location_type}
                    </span>
                  </div>
                </Link>
              )}
          </li>
        ))}
      </ul>
    );
  }
}

export default Select;
