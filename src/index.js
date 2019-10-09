import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from 'config/store';
import Pages from 'components/pages';

import 'styles/main.scss';

const App = () => (
  <Provider store={store}>
    <Pages />
  </Provider>
);

ReactDOM.render(<App />, document.getElementById('root'));
