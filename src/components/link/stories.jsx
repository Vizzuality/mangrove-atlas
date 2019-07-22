import React from 'react';
import { storiesOf } from '@storybook/react';
import { withProvider } from 'utils/storybookProvider';
import DownloadLink from './component';

storiesOf('Download link', module)
  .addDecorator(withProvider)
  .add('data', () => (
    <DownloadLink
      data
      filename
    />
  ));
