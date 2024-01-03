import Category from 'containers/categories-menu';
import Locations from 'containers/navigation/mobile/locations';
import MapToggle from 'containers/navigation/mobile/map-toggle';
import WidgetsMenu from 'containers/widgets/widgets-menu';

import { Dialog, DialogContent, DialogTrigger, DialogClose } from 'components/dialog';
import Icon from 'components/icon';

import CONFIGS_SVG from 'svgs/sidebar/configure.svg?sprite';

const NavigationMobile = () => {
  return (
    <div className="fixed -bottom-0.5 z-50 h-36 w-full bg-[url('/images/mobile-sidebar-bg.svg')] bg-cover bg-no-repeat">
      <div className="item-center px-auto mt-20 flex h-full w-full justify-center space-x-10">
        <Locations />
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="flex h-full h-full flex-col items-center space-y-1 pt-1 text-white"
            >
              <Icon
                icon={CONFIGS_SVG}
                className="h-8 w-8 fill-white text-white"
                description="Configure widgets"
              />
              <span className="leading-2 font-sans text-xxs text-white">Configure</span>
            </button>
          </DialogTrigger>
          <DialogContent className="scroll-y left-0 top-6 max-h-[100%] min-h-fit w-full space-y-8 rounded-3xl">
            <div className="no-scrollbar max-h-[85vh] space-y-8 overflow-y-auto">
              <h2 className="font-black/85 text-2xl font-light leading-10">
                Widgets deck settings
              </h2>

              <Category />

              <WidgetsMenu />
            </div>
            <DialogClose />
          </DialogContent>
        </Dialog>

        <MapToggle />
      </div>
    </div>
  );
};

export default NavigationMobile;
