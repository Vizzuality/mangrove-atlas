import React from 'react';
import { storiesOf } from '@storybook/react';

import Spinner from './component';

storiesOf('Spinner', module)
  .add('is loading', () => (
    <Spinner
      isLoading
    />
  ))
  .add('is loaded', () => (
    <Spinner
      isLoading={false}
    />
  ));
