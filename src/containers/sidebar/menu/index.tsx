/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useState } from 'react';

import { EXT_MENU_OPTIONS } from 'containers/sidebar/constants';

import { Dialog, DialogContent, DialogTrigger } from 'components/dialog';
import Icon from 'components/icon';

import MENU_SVG from 'svgs/sidebar/menu.svg?sprite';

const Menu = () => {
  const [aboutSection, setAboutSection] = useState<boolean>(false);

  return (
    <>
      <div className="w-full pb-1 text-center font-sans text-xxs text-white">Menu</div>
      <div className="flex h-[60px] w-[60px] flex-col items-center justify-center rounded-full bg-white text-brand-800">
        <Dialog>
          <DialogTrigger>
            <div className="flex justify-center" onClick={() => setAboutSection(false)}>
              <Icon icon={MENU_SVG} className="h-8 w-8 text-brand-800" />
            </div>
          </DialogTrigger>
          <DialogContent className="scroll-y h-[540px] overflow-y-auto overflow-x-hidden rounded-[20px]">
            {!aboutSection && (
              <div className="text-black/85 flex flex-col">
                <h2 className="pb-3 text-xl font-bold">Global Mangrove Watch</h2>
                <button
                  className="pb-3 text-left text-2lg font-light"
                  onClick={() => setAboutSection(true)}
                >
                  About this tool
                </button>
                <p className="pb-3 text-left text-2lg font-light">Global Mangrove Alliance</p>
                <div className="flex flex-col space-y-3 border-l pl-7">
                  {EXT_MENU_OPTIONS.map(({ id, label, href }) => (
                    <a
                      key={id}
                      className="text-2lg font-light"
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {aboutSection && (
              <div className="font-sans">
                <h3 className="text-xl font-bold">About Global Mangrove Watch</h3>
                <h4 className="py-6 text-2lg font-bold">
                  Monitoring to catalyse the action needed to protect and restore mangroves
                </h4>
                <p className="pb-5 text-2lg font-light">
                  Thriving mangroves are key to the health of nature and effective climate action.
                  Global Mangrove Watch (GMW) is an online platform that provides the remote sensing
                  data and tools for monitoring mangroves necessary for this. It gives universal
                  access to near real-time information on where and what changes there are to
                  mangroves across the world, and highlights why they are valuable.
                </p>
                <p className="pb-5 text-2lg font-light">
                  With hi-res information on topography, soil conditions and hydrology, Global
                  Mangrove Watch gives coastal and park managers, conservationists, policymakers and
                  practitioners the evidence needed to respond to illegal logging, pinpoint the
                  causes of local mangrove loss and track restoration progress. It is a tool that
                  can help mangroves be central to climate mitigation, adaptation and sustainable
                  development plans and policies.
                </p>
                <h4 className="py-6 text-2lg font-bold">Global Mangrove Watch Partners</h4>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Menu;