import { useState } from 'react';

import Link from 'next/link';

import cn from 'lib/classnames';

import { HiChevronDown } from 'react-icons/hi2';

import ContactForm from 'containers/contact';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from 'components/ui/collapsible';

const RESOURCES_LINKS = [
  {
    label: 'Restoration Best Practices',
    href: 'https://www.mangrovealliance.org/best-practice-guidelines-for-mangrove-restoration',
  },
  {
    label: 'State of the Worlds Mangroves 2024',
    href: 'https://tnc.box.com/s/2kc5d5ldql7x87t8g9vlneotugyvay46',
  },
  {
    label: 'GMW Leaflet',
    href: 'https://tnc.box.com/s/syxr8ul76h0j7sgm8wfme6i8oub5d538',
  },
  {
    label: 'MRTT user guide',
    href: 'https://tnc.box.com/s/pspea7mm2m2uldrqvhahmvp9dck6mc06',
  },
  {
    label: 'Policy Brief: GMW and NBSAPs',
    href: 'https://tnc.box.com/s/rwh1immjasa5q0wil3pnys7grjlfkie1',
  },
  {
    label: 'Policy Brief: GMW and NDCs',
    href: 'https://tnc.box.com/s/uair7m72wvx3bcsk26w7gjoo04ul1v6j',
  },
  {
    label: 'Policy Brief: GMW and the Ramsar Convention',
    href: 'https://tnc.app.box.com/s/pcz1kx1sf4h8i23xxtlq50vw7mvl6ao5',
  },
  {
    label: 'Video Tutorial',
    href: 'https://www.youtube.com/playlist?list=PLVJGmVOGPDZoLvbW7Za051HVRSjDW1-Gw',
  },

  // {
  //   label: 'MRTT',
  //   href: 'https://www.mangrovealliance.org/news/new-the-mangrove-restoration-tracker-tool/',
  // },
  // { label: 'Training on conservation', href: 'https://www.mangrovealliance.org/' },
  // { label: 'Restoration best practices', href: 'https://www.mangrovealliance.org/' },
  // { label: 'State of the Worlds', href: 'https://www.mangrovealliance.org/' },
  // {
  //   label: 'GMW Leaflet',
  //   href: 'https://www.mangrovealliance.org/wp-content/uploads/2024/05/GMW_Leaflet_2024-update.pdf',
  // },
  // { label: 'Policy document', href: 'https://www.mangrovealliance.org/' },
];

const ResourcesMenu = ({ setSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex flex-col space-y-4">
      <button
        type="button"
        className="text-left text-2lg font-light hover:text-brand-800"
        onClick={() => setSection('about')}
      >
        About this tool
      </button>
      <Link
        href="https://www.mangrovealliance.org/"
        className="text-2lg font-light hover:text-brand-800"
        rel="noopener noreferrer"
        target="_blank"
      >
        Global Mangrove Alliance
      </Link>
      <Link
        href={`${process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ? process.env.NEXT_PUBLIC_MRTT_SITE_PROD : process.env.NEXT_PUBLIC_MRTT_SITE_STAGING}`}
        className="text-2lg font-light hover:text-brand-800"
        rel="noopener noreferrer"
        target="_blank"
      >
        Mangrove Restoration Tracker Tool
      </Link>

      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-4">
        <CollapsibleTrigger iconType={null} className="p-0">
          <div className="flex w-full items-center space-x-4 text-2lg font-light hover:text-brand-800">
            <span className={cn({ 'text-brand-800': isOpen })}>Resources</span>
            <HiChevronDown
              className={cn({
                'h-4 w-4 stroke-[1px]': true,
                'rotate-180 text-brand-800': isOpen,
              })}
            />
            <span className="sr-only">Toggle</span>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="flex flex-col space-y-2 border-l border-l-grey-400/20 px-6">
            {RESOURCES_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-2lg font-light text-black/85 hover:text-brand-800"
              >
                {label}
              </a>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ResourcesMenu;
