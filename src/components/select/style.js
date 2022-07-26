
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
    minWidth: 30,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    transform: 'translateX(-50%)',
    left: '50%',
    '&:after': {
      content: '" "',
      display: 'block',
      position: 'absolute',
      width: 0,
      height: 0,
      left: '50%',
      borderStyle: 'solid',
      bottom: '99%',
      borderColor: 'transparent transparent white transparent',
      borderWidth: '13px',
      transform: 'translateX(-13px)'
    },
    '&:before': {
      content: '" "',
      display: 'block',
      position: 'absolute',
      left: '50%',
      width: 0,
      height: 0,
      borderStyle: 'solid',
      bottom: '100%',
      borderColor: 'transparent transparent rgba(0, 0, 0, 0.1) transparent',
      borderWidth: '12px',
      transform: 'translateX(-12px)'
    },
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: 14,
    textAlign: 'center',
    opacity: state.isDisabled && !state.isSelected ? 0.4 : 1,
    color: state.isSelected ? '#00857F' : provided.color,
    backgroundColor: 'none',
    '&:hover': {
      color: '#00857F',
      cursor: state.isSelected ? 'default' : 'pointer'
    },
    '&:active': {
      backgroundColor: 'transparent'
    },
    whiteSpace: 'nowrap',
  }),
  singleValue: provided => ({
    ...provided,
    position: 'relative',
    transform: 'none',
    maxWidth: '100%',
    margin: 0,
    cursor: 'pointer',
    marginBottom: -4
  }),
  valueContainer: provided => ({
    ...provided,
    padding: 0
  }),
  dropdownIndicator: provided => ({
    ...provided,
    width: 0,
    height: 0,
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderTop: '6px solid #00857F',
    position: 'absolute',
    bottom: '-7px',
    left: '50%',
    transform: 'translate(-50%, 50%)',
    cursor: 'pointer',
  }),
  menuList: provided => ({
    ...provided,
    maxHeight: 250,
    minWidth: 'content',
    fontSize: 9,
  }),
};
