import React from 'react';
import { storiesOf } from '@storybook/react';
import TabsState from './component';

storiesOf('Options', module)
  .add('Options', () => (
    <TabsState initial="test2">
      <div id="Option 1" title="Option 1">
        {({ active, selected }) => (active ? <div>{selected} is selected</div> : null)}
      </div>
      <div id="Option 2" title="Option 2">
        <div>Option 2</div>
      </div>
    </TabsState>
  ));
