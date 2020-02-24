import React from 'react';
import PropTypes from 'prop-types';

import { translateText } from 'utils/functions';

const Translate = ({ text, params }) => <span className="notranslate">{translateText(text, params)}</span>;

Translate.propTypes = {
  text: PropTypes.string.isRequired,
  params: PropTypes.shape({}),
};

Translate.defaultProps = {
  params: undefined,
};

export default Translate;
