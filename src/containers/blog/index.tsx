import { useState } from 'react';

import Image, { StaticImageData } from 'next/image';

import cn from 'classnames';

import { useBlogPosts } from 'hooks/blog';

import { Dialog, DialogContent, DialogClose, DialogTrigger } from 'components/dialog';
import Icon from 'components/icon';

import placeholderPost from 'images/blog/placeholder-post.png';

import NEWS_SVG from 'svgs/ui/news.svg?sprite';

import Post from './post';

export const Blog = () => {
  const { data } = useBlogPosts();
  const [postInfo, setPostInfo] = useState(null);

  console.log({ postInfo });

  return (
    <Dialog>
      <DialogTrigger>
        <div className="absolute top-72 left-20 z-20 h-12 w-[540px] rounded-2xl bg-brand-800">
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
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="scroll-y top-4 h-[96vh] rounded-[20px] px-10 pt-10 font-sans">
        <div className="no-scrollbar overflow-y-auto">
          {!postInfo && (
            <>
              <h3 className="pb-6 text-3xl font-light">News</h3>
              <div className="flex flex-col space-y-4">
                {data.map((post) => (
                  <button key={post.id} onClick={() => setPostInfo(post)}>
                    <Post post={post} />
                  </button>
                ))}
              </div>
            </>
          )}
          {postInfo && (
            <div>
              <button className="absolute top-6 z-20" onClick={() => setPostInfo(null)}>
                Back to News
              </button>
              <Image
                alt={postInfo.title.rendered}
                className="absolute top-0 left-0 h-[240px] w-full rounded-t-[20px] object-cover"
                src={placeholderPost as StaticImageData}
              />
              <h3 className="mt-[240px] font-sans text-3xl font-light text-black/85">
                {postInfo.title.rendered}
              </h3>
            </div>
          )}
        </div>
        <DialogClose onClose={() => setPostInfo(null)} />
      </DialogContent>
    </Dialog>
  );
};

export default Blog;
