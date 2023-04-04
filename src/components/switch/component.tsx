import React from 'react';

import * as Switch from '@radix-ui/react-switch';

const SwitchDemo = () => (
  <form>
    <div className="flex items-center" style={{ display: 'flex', alignItems: 'center' }}>
      <label className="pr-[15px] text-[15px] leading-none text-white" htmlFor="airplane-mode">
        Airplane mode
      </label>
      <Switch.Root
        className="relative h-7 w-12 cursor-default rounded-full border-2 border-teal-0 border-opacity-20 outline-none data-[state=checked]:bg-teal-0"
        id="airplane-mode"
      >
        <Switch.Thumb className=" block h-5 w-5 translate-x-0.5 rounded-full bg-teal-0 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px] data-[state=checked]:bg-white" />
      </Switch.Root>
    </div>
  </form>
);

export default SwitchDemo;
