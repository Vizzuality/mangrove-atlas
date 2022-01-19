import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, number } from '@storybook/addon-knobs';

import Component from './component';


storiesOf('Legend item', module)
  .addDecorator(withKnobs)
  .add('Active', () => (
    <Component
      id={number('id', 1)}
      name={text('name', 'Mangrove coverage')}
      isActive
    />
  ));
