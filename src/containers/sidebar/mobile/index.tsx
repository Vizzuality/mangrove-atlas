import Category from 'containers/categories-menu';
import Menu from 'containers/navigation/menu';
import MapToggle from 'containers/sidebar/mobile/map-toggle';
import WidgetsMenu from 'containers/widgets/widgets-menu';

import { Dialog, DialogContent, DialogTrigger, DialogClose } from 'components/dialog';

import PlacesMobile from './places';

const SidebarMobile = () => {
  return (
    <div className="fixed -bottom-0.5 z-50 h-36 w-full bg-[url('/images/mobile-sidebar-bg.svg')] bg-cover bg-no-repeat">
      <div className="item-center px-auto mt-20 flex h-full w-full justify-center space-x-10">
        <Menu />
        <PlacesMobile />
        <Dialog>
          <DialogTrigger asChild className="h-8 w-8  ">
            <button
              type="button"
              className="flex h-8 py-1 font-sans text-sm font-semibold text-white"
            >
              CW
            </button>
          </DialogTrigger>
          <DialogContent className="scroll-y left-0 top-6 max-h-[100%] min-h-fit w-full space-y-8 rounded-3xl">
            <div className="no-scrollbar max-h-[85vh] space-y-8 overflow-y-auto">
              <h2 className="font-black/85 text-3xl font-light leading-10">
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

export default SidebarMobile;
