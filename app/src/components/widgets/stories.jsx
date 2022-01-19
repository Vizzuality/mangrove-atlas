import React from 'react';
import { storiesOf } from '@storybook/react';
import Component from './component';


storiesOf('Widgets', module)
  .add('Colapse', () => (
    <Component />
  ))
  .add('Expand', () => (
    <Component isCollapsed />
  ));
