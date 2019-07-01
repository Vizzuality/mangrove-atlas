import React, { PureComponent } from 'react';
import ReactSelect from 'react-select';
import { styles, theme } from './style';

class Select extends PureComponent {
  state = { selectedOption: null }

  options = {
    isSearchable: false,
    theme,
    styles,
    components: {
      DropdownIndicator: null
    }
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
      <ReactSelect
        // className={stylesCSS.select}
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
