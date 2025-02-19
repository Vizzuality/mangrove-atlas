'use-Client';

import { useEffect, useState } from 'react';

import Contact from 'containers/contact';

import Icon from 'components/ui/icon';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';

import HELP_SVG from 'svgs/tools-bar/help.svg?sprite';

import GuideSwitcher from './switcher';

export const HelpContainer = () => {
  return (
    <div>
      <Popover>
        <PopoverTrigger>
          <button
            id="guide"
            data-testid="guide-button"
            type="button"
            className="flex cursor-pointer items-center space-x-2"
          >
            <Icon icon={HELP_SVG} className="h-6 w-6 stroke-white" description="Menu" />
            <p className="font-sans text-sm text-white">Help</p>
          </button>
        </PopoverTrigger>

        <PopoverContent className="z-20 rounded-2xl p-6 text-sm font-semibold shadow-border">
          <Contact />
          <GuideSwitcher />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default HelpContainer;
