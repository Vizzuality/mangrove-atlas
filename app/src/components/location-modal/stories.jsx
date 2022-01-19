import React from 'react';
import { storiesOf } from '@storybook/react';
import { withProvider } from 'utils/storybookProvider';
import LocationSelector from './component';


storiesOf('Location modal', module)
  .addDecorator(withProvider)
  .add('open', () => (
    <LocationSelector isOpened />
  ));
