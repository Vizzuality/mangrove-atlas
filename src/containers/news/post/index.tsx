import { useMemo } from 'react';

import Image from 'next/image';

import { usePostTags } from 'hooks/blog';
import { PostProps } from 'hooks/blog/types';

export const Post = ({ post }: { post: PostProps }) => {
  const { data } = usePostTags(
    { id: post.id },
    {
      enabled: !!post.id,
    }
  );

  const isUpdate = useMemo(() => post.class_list.includes('wl_topic-update'), [post.class_list]);

  return (
    <div className="relative flex items-center">
      <div className="relative h-[114px] w-[112px] shrink-0">
        <Image
          alt={post.title.rendered}
          className="absolute top-0 left-0 h-[114px] w-[112px] rounded-2xl object-cover"
          src={post.yoast_head_json.og_image[0].url}
          fill={true}
        />
      </div>
      <div className="flex flex-col justify-start p-4">
        {isUpdate && (
          <span className="bg-brand-800 w-fit rounded-[4px] px-2 py-1 text-xs font-bold tracking-widest text-white uppercase">
            update
          </span>
        )}
        <div className="mb-2.5 flex flex-wrap gap-2">
          {data?.map((tag, i) => {
            return (
              <div
                key={i}
                className="bg-brand-400 flex w-fit items-center rounded-2xl px-3 py-1 text-xs font-semibold whitespace-nowrap text-white uppercase"
              >
                {tag.name}
              </div>
            );
          })}
        </div>
        <h5 data-testid="post-title" className="text-2lg line-clamp-3 text-left font-light">
          {post.title.rendered}
        </h5>
      </div>
    </div>
  );
};

export default Post;
