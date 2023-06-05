import { usePostTags } from 'hooks/blog';

export const Post = ({ post }: { post: { id: number; title: { rendered: string } } }) => {
  const { data } = usePostTags({ id: post.id });

  return (
    <div key={post.id} className="h-fit w-full rounded-[20px] border border-slate-100 p-1">
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
        <h5 className="text-2lg font-light">{post.title.rendered}</h5>
      </div>
    </div>
  );
};

export default Post;
