import Image from 'next/image';

import { usePostTags } from 'hooks/blog';

export const Post = ({
  post,
}: {
  post: {
    id: number;
    title: { rendered: string };
    yoast_head_json: { og_image: { url: string }[] };
  };
}) => {
  const { data } = usePostTags(
    { id: post.id },
    {
      enabled: !!post.id,
    }
  );

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
      <div className="flex flex-col p-4">
        <div className="mb-2.5 flex flex-wrap gap-2">
          {data?.map((tag, i) => {
            return (
              <div
                key={i}
                className="flex w-fit items-center whitespace-nowrap rounded-2xl bg-brand-400 py-1 px-3 text-xs font-semibold uppercase text-white"
              >
                {tag.name}
              </div>
            );
          })}
        </div>
        <h5 data-testid="post-title" className="text-left text-2lg font-light line-clamp-3">
          {post.title.rendered}
        </h5>
      </div>
    </div>
  );
};

export default Post;
