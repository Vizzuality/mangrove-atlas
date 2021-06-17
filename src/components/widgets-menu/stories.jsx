import React from 'react';
import { storiesOf } from '@storybook/react';
import Component from './component';

const categories = [
  'default',
  'Restoration & Conservation',
  'Climate & Policy',
  'Ecosystem Services',
];

storiesOf('Widgets menu', module)
  .add('Default', () => (
    <Component dashboards={categories} />
  ))
