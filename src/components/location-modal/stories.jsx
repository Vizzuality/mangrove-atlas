import React from 'react';
import { storiesOf } from '@storybook/react';
import LocationSelector from './component';


storiesOf('Location modal', module)
  .add('open', () => (
    <LocationSelector isOpened />
  ))
  .add('close', () => (
    <LocationSelector isClosed />
  ));
