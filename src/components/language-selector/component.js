import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';


class LanguageSelect extends PureComponent {
  static propTypes = {
    language: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      code: PropTypes.string,
    })),
    fetchLanguages: PropTypes.func.isRequired,
    setLanguage: PropTypes.func.isRequired,
  }

  static defaultProps = {
    language: 'en',
    data: null,
  }

  componentDidMount() {
    const { fetchLanguages, setLanguage } = this.props;
//     if (typeof window !== 'undefined') {
//       fetchLanguages();
// debugger
//       Transifex.live.onReady(() => {
//         const { code } = Transifex.live.getSourceLanguage();
//         const langCode = Transifex.live.detectLanguage();

//         // For any reason we have to translate at first to source code.
//         Transifex.live.translateTo(code);
//         Transifex.live.translateTo(langCode);
//         setLanguage(langCode);
//       });
//     }
  }

  handleChange({ langCode }) {
    const { setLanguage } = this.props;
  //  Transifex.live.translateTo(langCode);
    setLanguage(langCode);
  }

  render() {
    const { language, data } = this.props;
    const options = data.filter(l => !l.source).map(lang => ({
      label: lang.name,
      value: lang.code
    }));
    const currentValue = options.find(o => o.value === language);

    if (!data || !currentValue) return null;

    return (

      <ul className="nav flex-column">
        {options.map(o => (
          <li className="nav-item" key={`lang-${o.value}`}>
            <a
              href={`#${o.value}`}
              className="nav-link notranslate"
              onClick={(e) => {
                e.preventDefault();
                this.handleChange({ langCode: o.value });
              }}
            >
              {o.label}
            </a>
          </li>
        ))}
      </ul>
    );
  }
}


export default LanguageSelect;
