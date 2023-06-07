import { useState } from 'react';

import Image, { StaticImageData } from 'next/image';

import cn from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';

import { useBlogPosts } from 'hooks/blog';
import type { Post } from 'hooks/blog/types';

import PostComponent from 'containers/blog/post';

import { Dialog, DialogContent, DialogClose, DialogTrigger } from 'components/dialog';
import Icon from 'components/icon';

import placeholderPost from 'images/blog/placeholder-post.png';

import CLOSE_SVG from 'svgs/ui/close.svg?sprite';
import NEWS_SVG from 'svgs/ui/news.svg?sprite';

export const Blog = ({ setBlogBanner }: { setBlogBanner: (blogBanner: boolean) => void }) => {
  const { data } = useBlogPosts();
  const [postInfo, setPostInfo] = useState<Post | null>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative z-20 my-2 h-12 w-[540px] rounded-2xl bg-brand-800">
          <div className="flex h-full items-center justify-between px-4">
            <div className="flex items-center space-x-4">
              <Icon
                icon={NEWS_SVG}
                className={cn({
                  'h-7 w-7 fill-white': true,
                })}
              />
              <p className="font-sans text-sm text-white">
                Stay updated with the latest mangrove news!
              </p>
            </div>
            <button className="flex items-center rounded-2xl bg-white px-6 py-1 font-sans text-sm text-brand-800 transition duration-300 delay-150 ease-in-out hover:bg-transparent hover:text-white">
              Explore Now
            </button>
            <button onClick={() => setBlogBanner(false)}>
              <Icon icon={CLOSE_SVG} className="h-4 w-4 fill-white" />
            </button>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="scroll-y h-[96vh] rounded-[20px] px-10 py-0 font-sans md:max-w-xl">
        {!postInfo && (
          <div className="no-scrollbar overflow-y-auto pt-10">
            <h3 className="pb-6 text-3xl font-light">News</h3>
            <div className="flex flex-col space-y-4">
              {data?.map((post) => (
                <button
                  key={post.id}
                  className="flex h-fit w-full rounded-[20px] border border-slate-100 p-1 transition duration-300 hover:border-slate-400"
                  onClick={() => setPostInfo(post)}
                >
                  <PostComponent post={post} />
                </button>
              ))}
            </div>
          </div>
        )}
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
                className="absolute top-4 left-4 z-20 rounded-[20px] bg-white px-4 py-1 text-sm text-brand-800 transition duration-300 delay-150 ease-in-out hover:bg-brand-800 hover:text-white"
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
        <DialogClose onClose={() => setPostInfo(null)} />
      </DialogContent>
    </Dialog>
  );
};

export default Blog;
