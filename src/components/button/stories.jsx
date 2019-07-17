import React from 'react';
import { storiesOf } from '@storybook/react';
//import { withThemesProvider } from 'storybook-addon-styled-component-theme';
import Button from './component';
import styles from './style.module.scss';

const defaultTheme = {
  name: 'DEFAULT',
  backgroundColor: 'azure',
  textColor: 'dimgrey',
  borderRadius: '30px',
};

const darkTheme = {
  name: 'DARK',
  backgroundColor: 'black',
  textColor: 'seashell',
  borderRadius: '100px',
};

const getAllThemes = () => [defaultTheme, darkTheme];

storiesOf('Button/Primary', module)
  .addParameters({ options: { theme: styles.contrast } })
  .add('Active', () => (
    <Button isPrimary>Active</Button>
  ))
  .add('Disabled', () => (
    <Button isPrimary isDisabled>Disabled</Button>
  ));

storiesOf('Button/Secondary', module)
  .add('Active', () => (
    <Button isSecondary>Grey</Button>
  ))
  .add('Disabled', () => (
    <Button isSecondary>Disabled</Button>
  ));

storiesOf('Button/Background', module)
  .add('Active', () => (
    <Button hasBackground>Background</Button>
  ))
  .add('Disabled', () => (
    <Button isDisabled>Disabled</Button>
  ));
