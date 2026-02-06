import { UseQueryOptions, UseQueryResult, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import type { Tag, PostProps } from 'hooks/blog/types';

import { BlogAPI } from 'services/api';

type UseBlogParams = { wl_topic?: number[] };

type BlogQueryKey = ['blog-posts', UseBlogParams | undefined];

export function useBlogPosts<TSelected = PostProps[]>(
  params?: UseBlogParams,
  options?: UseQueryOptions<PostProps[], Error, TSelected, BlogQueryKey>
): UseQueryResult<TSelected, Error> {
  const fetchBlogPosts = async () => {
    const res = await BlogAPI.request<PostProps[]>({
      method: 'GET',
      url: '/wp-json/wp/v2/posts',
      params,
    });
    return res.data;
  };

  return useQuery<PostProps[], Error, TSelected, BlogQueryKey>(
    ['blog-posts', params],
    fetchBlogPosts,
    {
      placeholderData: [],
      ...options,
    }
  );
}

export function usePostTags(
  { id }: { id: number },
  options?: UseQueryOptions<Tag[], unknown>
): UseQueryResult<Tag[], unknown> {
  const fetchPostTags = () =>
    BlogAPI.request({
      method: 'GET',
      url: `/wp-json/wp/v2/tags?post=${id}`,
    }).then((response: AxiosResponse<Tag[]>) => response.data);

  const query = useQuery(['post-tags', id], fetchPostTags, {
    placeholderData: [],
    ...options,
  });

  return query;
}
