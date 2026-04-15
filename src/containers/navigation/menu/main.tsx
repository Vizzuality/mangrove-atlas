import ContactForm from '@/containers/contact';
import PartnersLinks from '@/containers/navigation/menu/partners';

import ResourcesMenu from './resources';
import { UserMenu } from './user';

const MainMenu = ({ setSection }) => {
  return (
    <div className="space-y-6 divide-y-2 divide-gray-100">
      <div className="space-y-6 py-6">
        {JSON.parse(process.env.NEXT_PUBLIC_FEATURED_FLAGS || '{}')['login'] === true && (
          <UserMenu setSection={setSection} />
        )}
        <ContactForm className="text-2lg hover:text-brand-800 text-left font-light" />
      </div>
      <div className="space-y-12">
        <ResourcesMenu setSection={setSection} />
        <PartnersLinks />
      </div>
    </div>
  );
};

export default MainMenu;
