import Image from 'next/image';

import { HiX } from 'react-icons/hi';

import type { PostProps } from 'hooks/blog/types';

import LayoutMdx from '@/layouts/mdx';

const HiXIcon = HiX as unknown as (p: React.SVGProps<SVGSVGElement>) => JSX.Element;

const TooltipItem = ({ post }: { post: PostProps }) => (
  <li className="flex cursor-pointer items-start space-x-2 rounded-sm p-2 transition hover:bg-gray-100">
    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-sm">
      <Image
        src={post.yoast_head_json.og_image[0].url}
        alt={post.title.rendered}
        fill
        className="object-cover"
      />
    </div>

    <div className="flex min-w-0 flex-1 flex-col">
      <span className="bg-brand-800 text-xxs w-fit rounded-sm px-2 font-bold text-white uppercase">
        update
      </span>

      <LayoutMdx className="text-xs leading-4 font-light">{post.title.rendered}</LayoutMdx>
    </div>
  </li>
);

const NewsTooltipBody = ({
  unseenPosts,
  onDismissTooltip,
}: {
  unseenPosts: PostProps[];
  onDismissTooltip: () => void;
}) => (
  <>
    {!unseenPosts?.length && (
      <div className="max-w-xs space-y-1 sm:max-w-70">
        <div className="flex items-center justify-between space-x-2 font-bold">
          <span className="text-xs uppercase">Tool updated!</span>
          <HiXIcon
            className="absolute top-2 right-2 h-4 w-4 cursor-pointer font-extrabold"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDismissTooltip();
            }}
          />
        </div>
        <p className="text-sm">
          A new version is live. See what’s been improved and discover the new features added to the
          tool.
        </p>
      </div>
    )}

    <ul className="max-w-2xs space-y-2">
      {unseenPosts?.map((post) => <TooltipItem key={post.id} post={post} />)}
      <HiXIcon
        className="absolute top-2 right-2 h-4 w-4 cursor-pointer font-extrabold"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDismissTooltip();
        }}
      />
    </ul>
  </>
);

export default NewsTooltipBody;
