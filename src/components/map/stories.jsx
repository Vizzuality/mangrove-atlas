import React from 'react';
import { storiesOf } from '@storybook/react';
import { withProvider } from 'utils/storybookProvider';
import Map from './component';

storiesOf('Map', module)
  .addDecorator(withProvider)
  .add('map', () => (
    <div style={{ width: '400px', height: '300px' }}>
      <Map />
    </div>
  ));
