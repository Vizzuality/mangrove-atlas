import { useState } from 'react';

import Image from 'next/image';

import { AnimatePresence, motion } from 'motion/react';

import { useBlogPosts, usePostTags } from 'hooks/blog';
import type { PostProps } from 'hooks/blog/types';

import PostComponent from '@/containers/news/post';

import { DialogClose } from '@/components/ui/dialog';

export const BlogContent = () => {
  const { data } = useBlogPosts({ wl_topic: [53] });

  const [postInfo, setPostInfo] = useState<PostProps | null>(null);
  const { data: dataTags } = usePostTags(
    { id: postInfo?.id },
    {
      enabled: !!postInfo,
    }
  );
  return (
    <>
      <AnimatePresence>
        {!postInfo && (
          <motion.div
            className="no-scrollbar flex flex-col overflow-y-auto"
            initial="hidden"
            animate="displayed"
            variants={{
              hidden: { opacity: 0 },
              displayed: { opacity: 1 },
            }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="py-6 text-3xl leading-1 font-light">News</h3>
            <div className="flex flex-col space-y-4" data-testid="posts-list">
              {data?.map((post) => (
                <button
                  aria-label={`navigate to post - ${post.title.rendered}`}
                  key={post.id}
                  data-testid={`post-${post.id}`}
                  className="flex h-32 w-full items-center rounded-3xl border border-slate-100 px-2 transition duration-300 hover:border-slate-400"
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
            className="no-scrollbar overflow-x-visible overflow-y-auto"
            initial="hidden"
            animate="displayed"
            data-testid="post-info"
            variants={{
              hidden: { opacity: 0 },
              displayed: { opacity: 1 },
            }}
            transition={{ duration: 0.4 }}
          >
            <div className="absolute top-0 left-0 h-[240px] w-full">
              <button
                data-testid="back-to-news-button"
                type="button"
                aria-label="back to news"
                className="pointer-events-all text-brand-800 hover:bg-brand-800 absolute top-8 left-8 z-20 bg-white px-4 py-1 text-sm transition delay-150 duration-300 ease-in-out hover:text-white md:top-4 md:rounded-3xl"
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
                  className="bg-brand-400 flex w-fit items-center rounded-2xl px-3 py-1 text-xs font-semibold whitespace-nowrap text-white uppercase"
                >
                  {tag.name}
                </div>
              ))}
            </div>
            <h3
              className="mt-10 font-sans text-3xl font-light text-black/85"
              data-testid="post-heading"
            >
              {postInfo.title.rendered}
            </h3>
            <div
              className="prose py-4"
              dangerouslySetInnerHTML={{ __html: postInfo.content.rendered }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <DialogClose
        onClose={() => setPostInfo(null)}
        className="top-8 md:fixed md:top-18! md:left-[595px]"
      />
    </>
  );
};

export default BlogContent;
