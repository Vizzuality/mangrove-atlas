import PartnersLinks from '@/containers/navigation/menu/partners';

import ResourcesMenu from './resources';
import { UserMenu } from './user';

const MainMenu = ({ setSection }) => {
  return (
    <div className="space-y-6 divide-y-2 divide-gray-100">
      <UserMenu setSection={setSection} />
      <div className="space-y-12">
        <ResourcesMenu setSection={setSection} />
        <PartnersLinks />
      </div>
    </div>
  );
};

export default MainMenu;
