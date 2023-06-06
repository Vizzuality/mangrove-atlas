import Image, { StaticImageData } from 'next/image';

import { usePostTags } from 'hooks/blog';

import placeholderPost from 'images/blog/placeholder-post.png';

export const Post = ({ post }: { post: { id: number; title: { rendered: string } } }) => {
  const { data } = usePostTags({ id: post.id });

  return (
    <div className="flex">
      <Image
        alt={post.title.rendered}
        className="h-[114px] w-28 rounded-2xl object-cover"
        src={placeholderPost as StaticImageData}
        width={112}
        height={114}
      />
      <div className="flex flex-col space-y-2.5 p-4">
        <div className="flex flex-wrap gap-2">
          {data?.map((tag, i) => {
            return (
              <div
                key={i}
                className="itens-center flex w-fit whitespace-nowrap rounded-2xl bg-brand-400 py-1 px-3 text-xs font-semibold uppercase text-white"
              >
                {tag.name}
              </div>
            );
          })}
        </div>
        <h5 className="text-left text-2lg font-light">{post.title.rendered}</h5>
      </div>
    </div>
  );
};

export default Post;
