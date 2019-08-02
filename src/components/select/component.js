import React, { PureComponent } from 'react';
import ReactSelect from 'react-select';
import PropTypes from 'prop-types';

import { styles, theme } from './style';

class Select extends PureComponent {
  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    value: PropTypes.shape({}),
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
    const selectedValue = options.find(opt => opt.defaultValue === selectedOption);

    console.log(options)

    return (
      <ReactSelect
        className={styles.select}
        {...this.options}
        {...props}
        options={options}
        onChange={this.handleChange}
        value={selectedValue}
      />
    );
  }
}

export default Select;
