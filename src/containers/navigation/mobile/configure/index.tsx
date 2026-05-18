import WidgetsDeckContent from '@/containers/widgets/widgets-deck/content';

import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import CONFIGS_SVG from '@/svgs/sidebar/configure';

const ConfigureWidgets = () => {
  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <button
              type="button"
              className="flex w-14 cursor-pointer flex-col items-center justify-center space-y-1 text-white transition-opacity hover:opacity-80 focus-visible:opacity-80 focus-visible:outline-none"
              data-testid="widgets-deck-trigger-mobile"
              aria-label="Configure widgets"
            >
              <CONFIGS_SVG
                className="h-8 w-8 fill-current text-white"
                role="img"
                title="Widgets deck"
              />
              <span className="text-xxs font-sans leading-none text-white">Configure</span>
            </button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="top">Configure widgets</TooltipContent>
      </Tooltip>

      <WidgetsDeckContent />
    </Dialog>
  );
};

export default ConfigureWidgets;
