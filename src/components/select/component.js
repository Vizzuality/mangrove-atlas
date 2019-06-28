import React, { PureComponent } from 'react';
import ReactSelect from 'react-select';
import styles from './style.module.scss';

const theme = {
  borderRadius: 0,
  spacing: {
    minHeight: 30 // line-height
  }
};

const customStyles = {
  container: provided => ({
    ...provided,
    display: 'inline-block'
  }),
  control: provided => ({
    ...provided,
    width: 'auto',
    border: 0
  }),
  dummyInput: () => ({
    width: 0
  }),
  input: provided => ({
    ...provided,
    position: 'absolute'
  }),
  singleValue: provided => ({
    ...provided,
    position: 'relative',
    transform: 'none',
    maxWidth: '100%',
    margin: 0
  }),
  valueContainer: provided => ({
    ...provided,
    padding: 0
  })
};

class Select extends PureComponent {
  state = { selectedOption: null }

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
        className={styles.select}
        value={selectedValue}
        options={options}
        onChange={this.handleChange}
        isSearchable={false}
        theme={theme}
        components={{
          DropdownIndicator: null
        }}
        styles={customStyles}
        {...props}
      />
    );
  }
}

export default Select;
