import React from 'react';
import { storiesOf } from '@storybook/react';
import Component from './component';

storiesOf('Basemap Selector', module)
  .add('Light active', () => (
    <Component basemapName="light" />
  ))
  .add('Dark active', () => (
    <Component basemapName="dark" />
  ))
  .add('Satllite active', () => (
    <Component basemapName="satellite" />
  ));
