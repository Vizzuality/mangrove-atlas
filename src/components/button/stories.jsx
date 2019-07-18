import React from 'react';
import { storiesOf } from '@storybook/react';
import Button from './component';
import styles from './style.module.scss';

storiesOf('Button/Background/Primary', module)
  .addParameters({ options: { theme: styles.contrast } })
  .add('Active', () => (
    <Button hasBackground>Active</Button>
  ))
  .add('Disabled', () => (
    <Button hasBackground isDisabled>Disabled</Button>
  ));

storiesOf('Button/Background/Contrast', module)
  .addParameters({ options: { theme: styles.contrast } })
  .add('Active', () => (
    <Button hasBackground hasContrast>Active</Button>
  ))
  .add('Disabled', () => (
    <Button hasBackground hasContrast isDisabled>Disabled</Button>
  ));

storiesOf('Button/Transparent/Primary', module)
  .add('Active', () => (
    <Button isTransparent>Grey</Button>
  ))
  .add('Disabled', () => (
    <Button isTransparent hasContrast isDisabled>Disabled</Button>
  ));

storiesOf('Button/Transparent/Contrast', module)
  .add('Active', () => (
    <Button isTransparent hasContrast>Background</Button>
  ))
  .add('Disabled', () => (
    <Button isTransparent hasContrast isDisabled>Disabled</Button>
  ));

storiesOf('Button/Transparent/Greys', module)
  .add('Active', () => (
    <Button isTransparent isGrey>Background</Button>
  ))
  .add('Disabled', () => (
    <Button isTransparent isGrey isDisabled>Disabled</Button>
  ));
