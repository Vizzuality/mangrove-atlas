import Category from 'containers/categories-menu';
import WidgetsMenu from 'containers/widgets/widgets-menu';

import { Dialog, DialogContent, DialogTrigger, DialogClose } from 'components/dialog';
import Icon from 'components/icon';

import CONFIGS_SVG from 'svgs/sidebar/configure.svg?sprite';

const ConfigureWidgets = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex flex-col items-center space-y-1 pt-1 text-white">
          <Icon
            icon={CONFIGS_SVG}
            className="h-8 w-8 fill-white text-white"
            description="Configure widgets"
          />
          <span className="leading-2 font-sans text-xxs text-white">Configure</span>
        </div>
      </DialogTrigger>
      <DialogContent className="scroll-y left-0 top-0 min-h-screen w-full space-y-8 rounded-none">
        <div className="no-scrollbar max-h-[95vh] space-y-8 overflow-y-auto">
          <h2 className="font-black/85 text-3xl font-light leading-10">Widgets deck settings</h2>

          <Category />

          <WidgetsMenu />
        </div>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
};

export default ConfigureWidgets;
