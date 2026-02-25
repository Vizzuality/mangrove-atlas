import Category from '@/containers/categories-menu';
import WidgetsMenu from '@/containers/widgets/widgets-menu';

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle,
} from '@/components/ui/dialog';
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
            className="fill-current h-8 w-8 fill-white text-white"
            role="img"
            title="Widgets deck"
          />
          <span className="text-xxs font-sans leading-2 text-white">Configure</span>
        </div>
      </DialogTrigger>
      <DialogContent className="top-0 left-0 min-h-screen w-screen space-y-8 rounded-none">
        <div className="no-scrollbar space-y-8 overflow-y-auto">
          <DialogTitle className="font-black/85 text-3xl leading-10 font-light">
            Widgets deck settings
          </DialogTitle>

          <Category />

          <WidgetsMenu />
        </div>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
};

export default ConfigureWidgets;
