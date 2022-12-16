import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';

import store from 'config/store';
import Pages from 'components/pages';
import Icons from 'components/icons';

import 'styles/main.scss';

const App = () => {
  const queryClient = new QueryClient()

  return (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <Pages />
      <Icons />
    </QueryClientProvider>
  </Provider>
)};

ReactDOM.render(<App />, document.getElementById('root'));
