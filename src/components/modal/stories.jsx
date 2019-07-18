import React from 'react';
import { storiesOf } from '@storybook/react';
import { withProvider } from 'utils/storybookProvider';
import Modal from './component';

storiesOf('Modal', module)
  .addDecorator(withProvider)
  .add('Open', () => (
    <Modal />
  ));
