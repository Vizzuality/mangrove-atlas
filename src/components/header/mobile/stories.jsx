import React from 'react';
import { storiesOf } from '@storybook/react';

import Component from './component';

storiesOf('Header', module)
  .add('header', () => (
    <Component />
  ));
