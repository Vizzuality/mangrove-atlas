import cn from 'lib/classnames';

import HighlightedPlaces from 'containers/highlighted-places';
import LocationsList from 'containers/locations-list';

import { Dialog, DialogTrigger, DialogContent } from 'components/dialog';
import Icon from 'components/icon';

import AREA_SVG from 'svgs/sidebar/area.svg?sprite';
import GLASS_SVG from 'svgs/sidebar/glass.svg?sprite';
import GLOBE_SVG from 'svgs/sidebar/globe.svg?sprite';
import MAP_SETTINGS_SVG from 'svgs/sidebar/map_settings.svg?sprite';
import MENU_SVG from 'svgs/sidebar/menu.svg?sprite';

import Item from './item';
import Menu from './menu';

const Sidebar = () => {
  return (
    <div
      className={cn({
        'absolute left-0 z-10 flex h-screen w-[80px] flex-col items-start justify-start bg-brand-600 p-2.5 py-20':
          true,
      })}
    >
      <div className="w-[90%] space-y-4">
        <Item title="Menu">
          <Dialog>
            <DialogTrigger>
              <Icon icon={MENU_SVG} className="h-full w-full" />
            </DialogTrigger>
            <DialogContent>
              <HighlightedPlaces />
              <LocationsList />
            </DialogContent>
          </Dialog>
        </Item>
        <Item title="Settings">
          <button type="button">
            <Icon icon={MAP_SETTINGS_SVG} className="h-full w-full" />
          </button>
        </Item>
        <div className="">
          <Item title="Place">
            <Icon icon={GLOBE_SVG} className="h-full w-full fill-current text-brand-600" />
            <Icon icon={GLASS_SVG} className="h-full w-full" />
            <Icon icon={AREA_SVG} className="h-full w-full" />
          </Item>
        </div>
        {/* <Menu /> */}
      </div>
    </div>
  );
};

export default Sidebar;
