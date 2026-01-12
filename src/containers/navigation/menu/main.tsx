import { UserMenu } from './user';

import ResourcesMenu from './resources';
import PartnersLinks from 'containers/navigation/menu/partners';

const MainMenu = ({ setSection }) => {
  return (
    <div className="space-y-6 divide-y-2 divide-gray-100">
      <UserMenu setSection={setSection} />
      <div className="space-y-12 pt-6">
        <ResourcesMenu setSection={setSection} />
        <PartnersLinks />
      </div>
    </div>
  );
};

export default MainMenu;
