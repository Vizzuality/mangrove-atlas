import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import Map from './component';

storiesOf('Map', module)
  .addDecorator(withKnobs)
  .add('map', () => (
    <Map
      viewport={{ width: 500, height: 400 }}
    />
  ));
