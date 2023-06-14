/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useState } from 'react';

import Image, { StaticImageData } from 'next/image';

import { AnimatePresence, motion } from 'framer-motion';

import { useBlogPosts } from 'hooks/blog';
import type { Post } from 'hooks/blog/types';

import PostComponent from 'containers/blog/post';
import { EXT_MENU_OPTIONS, STYLES } from 'containers/sidebar/constants';

import { Dialog, DialogContent, DialogClose, DialogTrigger } from 'components/dialog';
import Icon from 'components/icon';

import placeholderPost from 'images/blog/placeholder-post.png';
import GMA_PNG from 'images/gma.png';
import VIZZUALITY_PNG from 'images/vizzuality.png';

import MENU_SVG from 'svgs/sidebar/menu.svg?sprite';

const Menu = () => {
  const { data } = useBlogPosts();
  const [section, setSection] = useState('main');
  const [postInfo, setPostInfo] = useState<Post | null>(null);

  return (
    <div>
      <div className="hidden w-full pb-1 text-center font-sans text-xxs text-white md:block">
        Menu
      </div>
      <div className={`${STYLES['icon-wrapper']}`}>
        <Dialog>
          <DialogTrigger>
            <div
              className="flex justify-center rounded-full p-1 md:bg-white"
              onClick={() => setSection('main')}
            >
              <Icon
                icon={MENU_SVG}
                className="h-8 w-10 stroke-white stroke-2 md:w-8 md:stroke-brand-800"
              />
            </div>
          </DialogTrigger>
          <DialogContent className="scroll-y top-24 h-[555px] rounded-3xl px-10 py-0">
            {section === 'main' && (
              <div className="flex flex-col py-10 text-black/85">
                <h2 className="pb-3 text-xl font-bold">Global Mangrove Watch</h2>
                <button
                  className="pb-3 text-left text-2lg font-light"
                  onClick={() => setSection('about')}
                >
                  About this tool
                </button>
                <p className="pb-3 text-left text-2lg font-light">Global Mangrove Alliance</p>
                <div className="mb-14 flex flex-col space-y-3 border-l pl-7">
                  {EXT_MENU_OPTIONS.map(({ id, label, href, section }) => (
                    <a
                      key={id}
                      className="cursor-pointer text-2lg font-light"
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => section && setSection(section)}
                    >
                      {label}
                    </a>
                  ))}
                </div>
                <div className="flex h-20 items-center justify-between font-sans text-xs font-semibold uppercase">
                  <div className="flex h-full flex-col justify-between">
                    <p>Powered by</p>
                    <Image alt="GMA" src={GMA_PNG} width={130} height={100} />
                  </div>
                  <div className="flex h-full flex-col items-end justify-between">
                    <p>Designed by</p>
                    <div className="flex h-full items-center">
                      <Image alt="Vizzuality" src={VIZZUALITY_PNG} width={130} height={100} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {section === 'about' && (
              <div className="no-scrollbar overflow-y-auto pt-3 font-sans before:absolute before:top-0 before:left-0 before:h-10 before:w-full before:rounded-t-[20px] before:bg-gradient-to-b before:from-white/100 before:to-white/20 before:content-[''] after:absolute after:bottom-0 after:left-0 after:h-10 after:w-full after:rounded-b-[20px] after:bg-gradient-to-b after:from-white/20 after:to-white/100 after:content-['']">
                <h3 className="pt-5 text-xl font-bold">About Global Mangrove Watch</h3>
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

            {section === 'news' && (
              <div className="no-scrollbar overflow-y-auto pt-3 font-sans">
                <AnimatePresence>
                  {!postInfo && (
                    <motion.div
                      className="no-scrollbar overflow-y-auto pt-10"
                      initial="hidden"
                      animate="displayed"
                      variants={{
                        hidden: { opacity: 0 },
                        displayed: { opacity: 1 },
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      <h3 className="pb-6 text-3xl font-light">News</h3>
                      <div className="flex flex-col space-y-4">
                        {data?.map((post) => (
                          <button
                            key={post.id}
                            className="flex h-fit w-full rounded-3xl border border-slate-100 p-1 transition duration-300 hover:border-slate-400"
                            onClick={() => setPostInfo(post)}
                          >
                            <PostComponent post={post} />
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {postInfo && (
                    <motion.div
                      className="no-scrollbar overflow-y-auto"
                      initial="hidden"
                      animate="displayed"
                      variants={{
                        hidden: { opacity: 0 },
                        displayed: { opacity: 1 },
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      <button
                        className="absolute top-4 left-4 z-20 rounded-3xl bg-white px-4 py-1 text-sm text-brand-800 transition duration-300 delay-150 ease-in-out hover:bg-brand-800 hover:text-white"
                        onClick={() => setPostInfo(null)}
                      >
                        Back to News
                      </button>
                      <Image
                        alt={postInfo.title.rendered}
                        className="absolute top-0 left-0 h-[240px] w-full rounded-t-[20px] object-cover"
                        src={placeholderPost as StaticImageData}
                      />
                      <h3 className="mt-[270px] font-sans text-3xl font-light text-black/85">
                        {postInfo.title.rendered}
                      </h3>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            <DialogClose />
          </DialogContent>
        </Dialog>
      </div>
      <div className="block w-full text-center font-sans text-xxs text-white md:hidden">Menu</div>
    </div>
  );
};

export default Menu;
