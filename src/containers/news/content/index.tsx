import { useState } from 'react';

import Image from 'next/image';

import cn from 'lib/classnames';

import { AnimatePresence, motion } from 'framer-motion';

import { useBlogPosts, usePostTags } from 'hooks/blog';
import type { Post } from 'hooks/blog/types';

import PostComponent from 'containers/news/post';

import { DialogClose } from 'components/dialog';

export const BlogContent = () => {
  const { data } = useBlogPosts();

  const [postInfo, setPostInfo] = useState<Post | null>(null);
  const { data: dataTags } = usePostTags({ id: postInfo?.id });
  return (
    <>
      <AnimatePresence>
        {!postInfo && (
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
            <h3 className="leading-1 pt-1 pb-6 text-3xl font-light">News</h3>
            <div className="flex flex-col space-y-4">
              {data?.map((post) => (
                <button
                  aria-label={`navigate to post - ${post.title.rendered}`}
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
            className="no-scrollbar overflow-y-auto overflow-x-visible"
            initial="hidden"
            animate="displayed"
            variants={{
              hidden: { opacity: 0 },
              displayed: { opacity: 1 },
            }}
            transition={{ duration: 0.4 }}
          >
            <div className="absolute top-0 left-0 h-[240px] w-full">
              <button
                type="button"
                aria-label="back to news"
                className="pointer-events-all absolute top-8 left-8 z-20 bg-white px-4 py-1 text-sm text-brand-800 transition duration-300 delay-150 ease-in-out hover:bg-brand-800 hover:text-white md:top-4 md:rounded-3xl"
                onClick={(e) => {
                  e.stopPropagation();
                  return setPostInfo(null);
                }}
              >
                Back to News
              </button>
              <div className="overflow-visible md:rounded-t-3xl">
                <Image
                  alt={postInfo.title.rendered}
                  className="h-[240px] w-[100px] object-cover md:rounded-t-3xl"
                  src={postInfo.yoast_head_json.og_image[0].url}
                  fill={true}
                />
              </div>
            </div>
            <div className="mt-64">
              {dataTags?.map((tag, i) => (
                <div
                  key={i}
                  className="flex w-fit items-center whitespace-nowrap rounded-2xl bg-brand-400 py-1 px-3 text-xs font-semibold uppercase text-white"
                >
                  {tag.name}
                </div>
              ))}
            </div>
            <h3 className="mt-10 font-sans text-3xl font-light text-black/85">
              {postInfo.title.rendered}
            </h3>
            <div
              className="prose py-4"
              dangerouslySetInnerHTML={{ __html: postInfo.content.rendered }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <DialogClose onClose={() => setPostInfo(null)} className="top-8" />
    </>
  );
};

export default BlogContent;
