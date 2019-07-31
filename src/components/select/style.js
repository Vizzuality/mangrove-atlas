
export const theme = defaultTheme => ({
  ...defaultTheme,
  borderRadius: 0,
  spacing: {
    minHeight: 30 // line-height
  },
  colors: {
    ...theme.colors,
    primary: '#00857F',
  }
});

export const styles = {
  container: provided => ({
    ...provided,
    display: 'inline-block',
    border: 0,
    borderBottom: '2px solid #00857F',
    fontWeight: 'bold',
    position: 'relative'
  }),
  control: provided => ({
    ...provided,
    width: 'auto',
    borderWidth: 0,
    outline: 0,
    boxShadow: 'none'
  }),
  dummyInput: () => ({
    width: 0
  }),
  input: provided => ({
    ...provided,
    position: 'absolute'
  }),
  menu: provided => ({
    ...provided,
    backgroundColor: 'white',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 10,
    boxShadow: '1px 4px 12px 0 rgba(0, 0, 0, 0.08)',
    boxSizing: 'content-box',
    marginTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingtop: 10,
    paddingBottom: 10,
    transform: 'translateX(-50%)',
    left: '50%',
    '&:before': {
      content: '" "',
      position: 'absolute',
      width: '0',
      height: '0',
      borderLeft: '10px solid transparent',
      borderRight: '10px solid transparent',
      borderBottom: '10px solid white',
      boxShadow: '1px 4px 12px 0 rgba(0, 0, 0, 0.08)',
      top: -15,
      left: '50%',
      transform: 'translate(-50%, 50%)',
    }
  }),
  menuOuterTop: provided => ({
    ...provided,
    backgroundColor: 'red',
    color: 'green'
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: 14,
    textAlign: 'center',
    color: state.isSelected ? '#00857F' : provided.color,
    backgroundColor: 'none',
    '&:hover': {
      color: '#00857F',
      cursor: 'pointer'
    }
  }),
  singleValue: provided => ({
    ...provided,
    position: 'relative',
    transform: 'none',
    maxWidth: '100%',
    margin: 0,
    cursor: 'pointer'
  }),
  valueContainer: provided => ({
    ...provided,
    padding: '0'
  }),
  dropdownIndicator: provided => ({
    ...provided,
    width: '0',
    height: '0',
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderTop: '6px solid #00857F',
    position: 'absolute',
    bottom: '-5px',
    left: '50%',
    transform: 'translate(-50%, 50%)',
    cursor: 'pointer',
  })
};
