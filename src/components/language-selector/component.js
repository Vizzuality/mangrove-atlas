import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ButtonGroup from 'components/buttonGroup';
import Button from 'components/button';

class LanguageSelect extends PureComponent {
  static propTypes = {
    language: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      code: PropTypes.string,
    })),
    fetchLanguages: PropTypes.func.isRequired,
    setCurrentLanguage: PropTypes.func.isRequired,
  }

  static defaultProps = {
    language: 'en',
    data: null,
  }

  componentDidMount() {
    const { fetchLanguages, setCurrentLanguage } = this.props;
    const { Transifex } = window;

    if (typeof window !== 'undefined') {
      fetchLanguages();
      if (Transifex && typeof Transifex !== 'undefined') {
        Transifex.live.onReady(() => {
          const { code } = Transifex.live.getSourceLanguage();
          const langCode = Transifex.live.detectLanguage();

          Transifex.live.translateTo(code);
          Transifex.live.translateTo(langCode);

          setCurrentLanguage(langCode);
        });
      }
    }
  }

  handleChange = ({ langCode }) => {
    const { Transifex } = window;
    const { setCurrentLanguage } = this.props;
    Transifex.live.translateTo(langCode);
    setCurrentLanguage(langCode);
  }

  render() {
    const { language, data } = this.props;

    const options = data.map(lang => ({
      label: lang.name,
      value: lang.code
    }));
    const currentValue = options.find(o => o.value === language);
    if (!data || !currentValue) return null;

    return (

      <ButtonGroup id="tx-live-lang-picker">
        {options.map(o => (
          <Button
            type="button"
            key={`lang-${o.value}`}
            onClick={() => this.handleChange({ langCode: o.value })}
          >
            {o.label}
          </Button>
        ))}
      </ButtonGroup>
    );
  }
}


export default LanguageSelect;
