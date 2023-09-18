import { useState } from 'react';

import Image from 'next/image';

import { AnimatePresence, motion } from 'framer-motion';

import { useBlogPosts } from 'hooks/blog';
import type { Post } from 'hooks/blog/types';

import PostComponent from 'containers/blog/post';

import { DialogClose } from 'components/dialog';

export const BlogContent = () => {
  const { data } = useBlogPosts();
  const [postInfo, setPostInfo] = useState<Post | null>(null);

  return (
    <>
      <AnimatePresence>
        {!postInfo && (
          <motion.div
            className="no-scrollbar overflow-y-auto px-10 pt-10"
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
            <div className="relative">
              <button
                type="button"
                aria-label="back to news"
                className="absolute top-4 left-4 z-[1000] rounded-3xl bg-white px-4 py-1 text-sm text-brand-800 transition duration-300 delay-150 ease-in-out hover:bg-brand-800 hover:text-white"
                onClick={() => setPostInfo(null)}
              >
                Back to News
              </button>
              <div className="relative h-[240px] w-full overflow-visible rounded-t-3xl">
                <Image
                  alt={postInfo.title.rendered}
                  className="absolute top-0 -left-10 h-[240px] w-[100px] rounded-t-3xl object-cover"
                  src={postInfo.yoast_head_json.og_image[0].url}
                  fill={true}
                />
              </div>
            </div>
            <h3 className="mt-10 px-10 font-sans text-3xl font-light text-black/85">
              {postInfo.title.rendered}
            </h3>
            <div
              className="prose p-10 py-4"
              dangerouslySetInnerHTML={{ __html: postInfo.content.rendered }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <DialogClose onClose={() => setPostInfo(null)} />
    </>
  );
};

export default BlogContent;
