import Helper from 'containers/guide/helper';

import Icon from 'components/icon';

import TRANSLATE_SVG from 'svgs/tools-bar/translate.svg?sprite';

const LanguageSelector = () => {
  return (
    <Helper
      className={{
        button: '-bottom-10 -right-1.5',
        tooltip: 'w-fit-content',
      }}
      tooltipPosition={{ top: -10, left: -60 }}
      message="main LanguageSelector"
    >
      <button
        data-testid="LanguageSelector-button"
        type="button"
        className="relative flex items-center space-x-2"
      >
        <Icon
          icon={TRANSLATE_SVG}
          className="h-6 w-6 stroke-white"
          description="language-selection"
        />
        <span className="font-sans text-sm text-white">English</span>
      </button>
    </Helper>
  );
};

export default LanguageSelector;
