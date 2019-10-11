import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { breakpoints } from 'utils/responsive';
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
      value: lang.code,
      code: (lang.code.split('_')[0]).toUpperCase()
    }));
    const currentValue = options.find(o => o.value === language);
    if (!data || !currentValue) return null;

    return (

      <ButtonGroup id="tx-live-lang-picker">
        {options.map(o => (
          <Button
            type="button"
            hasBackground={currentValue.value === o.value}
            hasContrast={currentValue.value === o.value}
            key={`lang-${o.value}`}
            onClick={() => this.handleChange({ langCode: o.value })}
          >
            <MediaQuery maxWidth={breakpoints.lg - 1}>
              { o.code }
            </MediaQuery>
            <MediaQuery minWidth={breakpoints.lg}>
              { o.label}
            </MediaQuery>

          </Button>
        ))}
      </ButtonGroup>
    );
  }
}


export default LanguageSelect;
