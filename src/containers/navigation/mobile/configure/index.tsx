import Category from 'containers/categories-menu';
import WidgetsMenu from 'containers/widgets/widgets-menu';

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle,
} from 'components/ui/dialog';
import Icon from 'components/ui/icon';

import CONFIGS_SVG from 'svgs/sidebar/configure.svg?sprite';

const ConfigureWidgets = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className="flex h-full flex-col items-center space-y-1 pt-1 text-white"
          data-testid="widgets-deck-trigger-mobile"
        >
          <Icon
            icon={CONFIGS_SVG}
            className="h-8 w-8 fill-white text-white"
            description="Widgets deck"
          />
          <span className="leading-2 font-sans text-xxs text-white">Configure</span>
        </div>
      </DialogTrigger>
      <DialogContent className="left-0 top-0 min-h-screen w-screen space-y-8 rounded-none">
        <div className="no-scrollbar space-y-8 overflow-y-auto">
          <DialogTitle className="font-black/85 text-3xl font-light leading-10">
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
