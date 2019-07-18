import React from 'react';
import { storiesOf } from '@storybook/react';
import ButtonGroup from './component';
import Button from '../button/component';

storiesOf('Button group', module)
  .add('buttons bar', () => (
    <ButtonGroup>
      <Button hasBrackground>Opción 1</Button>
      <Button hasBrackground>Opción 2</Button>
      <Button hasBrackground>Opción 3</Button>
    </ButtonGroup>
  ));
