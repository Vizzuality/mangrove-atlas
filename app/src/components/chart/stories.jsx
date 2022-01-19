import React from 'react';
import { storiesOf } from '@storybook/react';
import TooltipComponent from './tooltip/component';
import TickComponent from './tick/component';

storiesOf('Chart', module)
  .add('Tooltip', () => (
    <TooltipComponent />
  ))
  .add('Tick', () => (
    <TickComponent
      // unit={}
      // unitFormat={}
      fill={'#00857F'}/>
  ));
