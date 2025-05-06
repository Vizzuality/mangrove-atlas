import { useState } from 'react';

import Link from 'next/link';

import cn from 'lib/classnames';

import { AnimatePresence, motion } from 'framer-motion';
import { HiChevronDown } from 'react-icons/hi2';

import ContactForm from 'containers/contact';
import Helper from 'containers/help/helper';
import About from 'containers/navigation/menu/about';
import PartnersLinks from 'containers/navigation/menu/partners';
import BlogContent from 'containers/news/content';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from 'components/ui/collapsible';
import { Dialog, DialogContent, DialogClose, DialogTrigger } from 'components/ui/dialog';
import Icon from 'components/ui/icon';

import MENU_SVG from 'svgs/tools-bar/menu.svg?sprite';

const RESOURCES_LINKS = [
  {
    label: 'GMW Training',
    href: 'https://www.conservationtraining.org/',
  },
  {
    label: 'Restoration Best Practices',
    href: 'https://www.mangrovealliance.org/wp-content/uploads/2023/12/Best-Practice-Guidelines-for-Mangrove-Restoration_spreadsv5.pdf',
  },
  {
    label: 'State of the Worlds Mangroves 2024',
    href: 'https://www.mangrovealliance.org/wp-content/uploads/2024/07/SOWM-2024-HR.pdf',
  },
  {
    label: 'GMW Leaflet',
    href: 'https://www.wetlands.org/publication/global-mangrove-watch-leaflet/',
  },
    {
    label: 'MRTT user guide',
    href: 'https://www.mangrovealliance.org/wp-content/uploads/2023/07/MRTT-Guide-v15.pdf',
  },
  {
    label: 'Policy Brief: GMW and NBSAPs',
    href: 'https://www.mangrovealliance.org/wp-content/uploads/2024/10/Global-Mangrove-Watch-NBSAPs_-Update-2024.pdf',
  },
  {
    label: 'Policy Brief: GMW and NDCs',
    href: 'https://www.mangrovealliance.org/wp-content/uploads/2022/11/Global-Mangrove-Watch_NDC-Policy-Brief_update2024.pdf',
  },
  {
    label: 'Policy Brief: GMW and the Ramsar Convention',
    href: 'https://www.mangrovealliance.org/wp-content/uploads/2022/11/Global-Mangrove-Watch_RAMSAR-Policy-Brief_v7.pdf.pdf',
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

const Menu = () => {
  const [section, setSection] = useState('main');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog>
      <Helper
        className={{
          button: '-top-2 -right-4',
          tooltip: 'w-fit-content',
        }}
        tooltipPosition={{ top: -40, left: 0 }}
        message="main menu"
      >
        <DialogTrigger asChild>
          <button
            data-testid="menu-button"
            type="button"
            onClick={() => setSection('main')}
            className="flex h-full items-center space-x-2"
          >
            <Icon icon={MENU_SVG} className="h-6 w-6" description="Menu" />
            <span className="font-sans text-sm text-white">Menu</span>
          </button>
        </DialogTrigger>
      </Helper>

      <DialogContent
        data-testid="menu-content"
        className={cn({
          'font-sans  md:mb-20 md:w-[436px]': true,
          'h-fit py-0': section === 'main',
        })}
      >
        {section === 'main' && (
          <div className="space-y-10 py-10">
            <div className="flex w-full flex-col space-y-4 font-sans text-black/85">
              <h2 className="pb-8 text-2xl font-light leading-4 md:pt-0 md:text-3xl">
                Global Mangrove Watch
              </h2>
              <button
                type="button"
                className="text-left text-2lg font-light hover:text-brand-800"
                onClick={() => section && setSection('about')}
              >
                About this tool
              </button>
              <Link
                href="https://www.mangrovealliance.org/"
                className="text-2lg font-light hover:text-brand-800"
              >
                Global Mangrove Alliance
              </Link>
              <Link
                href="https://www.mangrovealliance.org/news/new-the-mangrove-restoration-tracker-tool/"
                className="text-2lg font-light hover:text-brand-800"
              >
                Mangrove Restoration Tracker Tool
              </Link>
              {process.env.NEXT_PUBLIC_VERCEL_ENV === 'development' && (
                <ContactForm className="text-left text-2lg font-light hover:text-brand-800" />
              )}

              <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-4">
                <CollapsibleTrigger showExpandIcon={false} className="p-0">
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
            <PartnersLinks />
          </div>
        )}
        <AnimatePresence>
          {section === 'about' && (
            <motion.div
              className="no-scrollbar overflow-y-auto font-sans"
              initial="hidden"
              animate="displayed"
              variants={{
                hidden: { opacity: 0 },
                displayed: { opacity: 1 },
              }}
              transition={{ duration: 0.4 }}
            >
              <About />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {section === 'news' && (
            <motion.div
              className="no-scrollbar overflow-y-auto pt-3 font-sans"
              initial="hidden"
              animate="displayed"
              variants={{
                hidden: { opacity: 0 },
                displayed: { opacity: 1 },
              }}
              transition={{ duration: 0.4 }}
            >
              <BlogContent />
            </motion.div>
          )}
        </AnimatePresence>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
};

export default Menu;
