import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withProvider } from 'utils/storybookProvider';
import Map from './component';

storiesOf('Map', module)
  .addDecorator(withKnobs)
  .addDecorator(withProvider)
  .add('map', () => (
    <div style={{ width: 500, height: 400 }}>
    <Map viewport={{ width: 500, height: 400 }} />
    </div>
  ));
