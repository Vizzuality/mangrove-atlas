import WidgetsDeckContent from '@/containers/widgets/widgets-deck/content';

import { Dialog, DialogTrigger } from '@/components/ui/dialog';

import CONFIGS_SVG from '@/svgs/sidebar/configure';

const ConfigureWidgets = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className="flex h-full flex-col items-center space-y-1 pt-1 text-white"
          data-testid="widgets-deck-trigger-mobile"
        >
          <CONFIGS_SVG
            className="h-8 w-8 fill-current text-white"
            role="img"
            title="Widgets deck"
          />
          <span className="text-xxs font-sans leading-2 text-white">Configure</span>
        </div>
      </DialogTrigger>

      <WidgetsDeckContent />
    </Dialog>
  );
};

export default ConfigureWidgets;
