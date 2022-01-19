import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, object } from '@storybook/addon-knobs';

import Select from './component';

const options = [
  { label: '1996', value: '1996' },
  { label: '2007', value: '2007' },
  { label: '2008', value: '2008' },
  { label: '2009', value: '2009' },
  { label: '2010', value: '2010' },
  { label: '2015', value: '2015' },
  { label: '2016', value: '2016' }
];

const defaultValue = { label: '2016', value: '2016' };

storiesOf('Select', module)
  .addDecorator(withKnobs)
  .add('Selector', () => (
    <Select
      defaultValue={object('defaultValue', defaultValue)}
      options={object('options', options)}
    />
  ));
