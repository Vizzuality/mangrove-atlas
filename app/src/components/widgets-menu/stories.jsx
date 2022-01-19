import React from 'react';
import { storiesOf } from '@storybook/react';
import Component from './component';

const categories = [
  'Distribution and Change',
  'Restoration & Conservation',
  'Climate & Policy',
  'Ecosystem Services',
];

storiesOf('Widgets menu', module)
  .add('Distribution and Change', () => (
    <Component dashboards={categories} />
  ))
