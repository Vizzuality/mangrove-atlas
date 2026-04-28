import { UseQueryOptions, UseQueryResult, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import type { Tag, PostProps } from 'hooks/blog/types';

import { BlogAPI } from 'services/api';

type UseBlogParams = { wl_topic?: number[] };

type BlogQueryKey = ['blog-posts', UseBlogParams | undefined];

export function useBlogPosts<TSelected = PostProps[]>(
  params?: UseBlogParams,
  options?: Omit<
    UseQueryOptions<PostProps[], Error, TSelected, BlogQueryKey>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<TSelected, Error> {
  const fetchBlogPosts = async () => {
    const res = await BlogAPI.request<PostProps[]>({
      method: 'GET',
      url: '/wp-json/wp/v2/posts',
      params,
    });
    return res.data;
  };

  return useQuery<PostProps[], Error, TSelected, BlogQueryKey>({
    queryKey: ['blog-posts', params],
    queryFn: fetchBlogPosts,
    placeholderData: [],
    ...options,
  });
}

export function usePostTags(
  { id }: { id: number },
  options?: Omit<UseQueryOptions<Tag[], unknown>, 'queryKey'>
): UseQueryResult<Tag[], unknown> {
  const fetchPostTags = () =>
    BlogAPI.request({
      method: 'GET',
      url: `/wp-json/wp/v2/tags?post=${id}`,
    }).then((response: AxiosResponse<Tag[]>) => response.data);

  const query = useQuery({
    queryKey: ['post-tags', id],
    queryFn: fetchPostTags,
    placeholderData: [],
    ...options,
  });

  return query;
}
